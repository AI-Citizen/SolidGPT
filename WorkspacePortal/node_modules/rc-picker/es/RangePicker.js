import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import _extends from "@babel/runtime/helpers/esm/extends";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import classNames from 'classnames';
import useMergedState from "rc-util/es/hooks/useMergedState";
import raf from "rc-util/es/raf";
import warning from "rc-util/es/warning";
import pickAttrs from "rc-util/es/pickAttrs";
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useCellRender } from "./hooks/useCellRender";
import useHoverValue from "./hooks/useHoverValue";
import usePickerInput from "./hooks/usePickerInput";
import usePresets from "./hooks/usePresets";
import useRangeDisabled from "./hooks/useRangeDisabled";
import useRangeOpen from "./hooks/useRangeOpen";
import useRangeViewDates from "./hooks/useRangeViewDates";
import useTextValueMapping from "./hooks/useTextValueMapping";
import useValueTexts from "./hooks/useValueTexts";
import PanelContext from "./PanelContext";
import PickerPanel from "./PickerPanel";
import PickerTrigger from "./PickerTrigger";
import PresetPanel from "./PresetPanel";
import RangeContext from "./RangeContext";
import { formatValue, getClosingViewDate, isEqual, isSameDate, isSameQuarter, isSameWeek, parseValue } from "./utils/dateUtil";
import getExtraFooter from "./utils/getExtraFooter";
import getRanges from "./utils/getRanges";
import { getValue, toArray, updateValues } from "./utils/miscUtil";
import { elementsContains, getDefaultFormat, getInputSize } from "./utils/uiUtil";
import { legacyPropsWarning } from "./utils/warnUtil";
import { getClearIcon } from "./utils/getClearIcon";
function reorderValues(values, generateConfig) {
  if (values && values[0] && values[1] && generateConfig.isAfter(values[0], values[1])) {
    return [values[1], values[0]];
  }
  return values;
}
function canValueTrigger(value, index, disabled, allowEmpty) {
  if (value) {
    return true;
  }
  if (allowEmpty && allowEmpty[index]) {
    return true;
  }
  if (disabled[(index + 1) % 2]) {
    return true;
  }
  return false;
}

// TMP type to fit for ts 3.9.2

function InnerRangePicker(props) {
  var _classNames2, _classNames3, _classNames4;
  var _ref = props,
    _ref$prefixCls = _ref.prefixCls,
    prefixCls = _ref$prefixCls === void 0 ? 'rc-picker' : _ref$prefixCls,
    id = _ref.id,
    style = _ref.style,
    className = _ref.className,
    popupStyle = _ref.popupStyle,
    dropdownClassName = _ref.dropdownClassName,
    transitionName = _ref.transitionName,
    dropdownAlign = _ref.dropdownAlign,
    getPopupContainer = _ref.getPopupContainer,
    generateConfig = _ref.generateConfig,
    locale = _ref.locale,
    placeholder = _ref.placeholder,
    autoFocus = _ref.autoFocus,
    disabled = _ref.disabled,
    format = _ref.format,
    _ref$picker = _ref.picker,
    picker = _ref$picker === void 0 ? 'date' : _ref$picker,
    showTime = _ref.showTime,
    use12Hours = _ref.use12Hours,
    _ref$separator = _ref.separator,
    separator = _ref$separator === void 0 ? '~' : _ref$separator,
    value = _ref.value,
    defaultValue = _ref.defaultValue,
    defaultPickerValue = _ref.defaultPickerValue,
    open = _ref.open,
    defaultOpen = _ref.defaultOpen,
    disabledDate = _ref.disabledDate,
    _disabledTime = _ref.disabledTime,
    dateRender = _ref.dateRender,
    monthCellRender = _ref.monthCellRender,
    cellRender = _ref.cellRender,
    panelRender = _ref.panelRender,
    presets = _ref.presets,
    ranges = _ref.ranges,
    allowEmpty = _ref.allowEmpty,
    allowClear = _ref.allowClear,
    suffixIcon = _ref.suffixIcon,
    clearIcon = _ref.clearIcon,
    pickerRef = _ref.pickerRef,
    inputReadOnly = _ref.inputReadOnly,
    mode = _ref.mode,
    renderExtraFooter = _ref.renderExtraFooter,
    onChange = _ref.onChange,
    onOpenChange = _ref.onOpenChange,
    onPanelChange = _ref.onPanelChange,
    onCalendarChange = _ref.onCalendarChange,
    _onFocus = _ref.onFocus,
    onBlur = _ref.onBlur,
    onMouseDown = _ref.onMouseDown,
    onMouseUp = _ref.onMouseUp,
    onMouseEnter = _ref.onMouseEnter,
    onMouseLeave = _ref.onMouseLeave,
    onClick = _ref.onClick,
    _onOk = _ref.onOk,
    _onKeyDown = _ref.onKeyDown,
    components = _ref.components,
    order = _ref.order,
    direction = _ref.direction,
    activePickerIndex = _ref.activePickerIndex,
    _ref$autoComplete = _ref.autoComplete,
    autoComplete = _ref$autoComplete === void 0 ? 'off' : _ref$autoComplete,
    changeOnBlur = _ref.changeOnBlur;
  var needConfirmButton = picker === 'date' && !!showTime || picker === 'time';
  var containerRef = useRef(null);
  var panelDivRef = useRef(null);
  var startInputDivRef = useRef(null);
  var endInputDivRef = useRef(null);
  var separatorRef = useRef(null);
  var startInputRef = useRef(null);
  var endInputRef = useRef(null);
  var arrowRef = useRef(null);

  // ============================ Warning ============================
  if (process.env.NODE_ENV !== 'production') {
    legacyPropsWarning(props);
  }

  // ============================= Misc ==============================
  var formatList = toArray(getDefaultFormat(format, picker, showTime, use12Hours));

  // Operation ref
  var operationRef = useRef(null);
  var mergedDisabled = React.useMemo(function () {
    if (Array.isArray(disabled)) {
      return disabled;
    }
    return [disabled || false, disabled || false];
  }, [disabled]);

  // ============================= Value =============================
  var _useMergedState = useMergedState(null, {
      value: value,
      defaultValue: defaultValue,
      postState: function postState(values) {
        return picker === 'time' && !order ? values : reorderValues(values, generateConfig);
      }
    }),
    _useMergedState2 = _slicedToArray(_useMergedState, 2),
    mergedValue = _useMergedState2[0],
    setInnerValue = _useMergedState2[1];

  // =========================== View Date ===========================
  // Config view panel
  var _useRangeViewDates = useRangeViewDates({
      values: mergedValue,
      picker: picker,
      defaultDates: defaultPickerValue,
      generateConfig: generateConfig
    }),
    _useRangeViewDates2 = _slicedToArray(_useRangeViewDates, 2),
    getViewDate = _useRangeViewDates2[0],
    setViewDate = _useRangeViewDates2[1];

  // ========================= Select Values =========================
  var _useMergedState3 = useMergedState(mergedValue, {
      postState: function postState(values) {
        var postValues = values;
        if (mergedDisabled[0] && mergedDisabled[1]) {
          return postValues;
        }

        // Fill disabled unit
        for (var i = 0; i < 2; i += 1) {
          if (mergedDisabled[i] && !postValues && !getValue(postValues, i) && !getValue(allowEmpty, i)) {
            postValues = updateValues(postValues, generateConfig.getNow(), i);
          }
        }
        return postValues;
      }
    }),
    _useMergedState4 = _slicedToArray(_useMergedState3, 2),
    selectedValue = _useMergedState4[0],
    setSelectedValue = _useMergedState4[1];

  // ============================= Modes =============================
  var _useMergedState5 = useMergedState([picker, picker], {
      value: mode
    }),
    _useMergedState6 = _slicedToArray(_useMergedState5, 2),
    mergedModes = _useMergedState6[0],
    setInnerModes = _useMergedState6[1];
  useEffect(function () {
    setInnerModes([picker, picker]);
  }, [picker]);
  var triggerModesChange = function triggerModesChange(modes, values) {
    setInnerModes(modes);
    if (onPanelChange) {
      onPanelChange(values, modes);
    }
  };

  // ============================= Open ==============================
  var _useRangeOpen = useRangeOpen(defaultOpen, open, activePickerIndex, changeOnBlur, startInputRef, endInputRef, getValue(selectedValue, 0), getValue(selectedValue, 1), mergedDisabled, onOpenChange),
    _useRangeOpen2 = _slicedToArray(_useRangeOpen, 4),
    mergedOpen = _useRangeOpen2[0],
    mergedActivePickerIndex = _useRangeOpen2[1],
    firstTimeOpen = _useRangeOpen2[2],
    _triggerOpen = _useRangeOpen2[3];
  var startOpen = mergedOpen && mergedActivePickerIndex === 0;
  var endOpen = mergedOpen && mergedActivePickerIndex === 1;

  // ========================= Disable Date ==========================
  var _useRangeDisabled = useRangeDisabled({
      picker: picker,
      selectedValue: selectedValue,
      locale: locale,
      disabled: mergedDisabled,
      disabledDate: disabledDate,
      generateConfig: generateConfig
    }, !mergedOpen || firstTimeOpen),
    _useRangeDisabled2 = _slicedToArray(_useRangeDisabled, 2),
    disabledStartDate = _useRangeDisabled2[0],
    disabledEndDate = _useRangeDisabled2[1];

  // ============================= Popup =============================
  // Popup min width
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    popupMinWidth = _useState2[0],
    setPopupMinWidth = _useState2[1];
  useEffect(function () {
    if (!mergedOpen && containerRef.current) {
      setPopupMinWidth(containerRef.current.offsetWidth);
    }
  }, [mergedOpen]);

  // ============================ Trigger ============================
  function triggerOpenAndFocus(index) {
    _triggerOpen(true, index, 'open');
    // Use setTimeout to make sure panel DOM exists
    raf(function () {
      var _inputRef$current;
      var inputRef = [startInputRef, endInputRef][index];
      (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
    }, 0);
  }
  function triggerChange(newValue, sourceIndex) {
    var values = newValue;
    var startValue = getValue(values, 0);
    var endValue = getValue(values, 1);

    // >>>>> Format start & end values
    if (startValue && endValue && generateConfig.isAfter(startValue, endValue)) {
      if (
      // WeekPicker only compare week
      picker === 'week' && !isSameWeek(generateConfig, locale.locale, startValue, endValue) ||
      // QuotaPicker only compare week
      picker === 'quarter' && !isSameQuarter(generateConfig, startValue, endValue) ||
      // Other non-TimePicker compare date
      picker !== 'week' && picker !== 'quarter' && picker !== 'time' && !isSameDate(generateConfig, startValue, endValue)) {
        // Clean up end date when start date is after end date
        if (sourceIndex === 0) {
          values = [startValue, null];
          endValue = null;
        } else {
          startValue = null;
          values = [null, endValue];
        }
      } else if (picker !== 'time' || order !== false) {
        // Reorder when in same date
        values = reorderValues(values, generateConfig);
      }
    }
    setSelectedValue(values);
    var startStr = values && values[0] ? formatValue(values[0], {
      generateConfig: generateConfig,
      locale: locale,
      format: formatList[0]
    }) : '';
    var endStr = values && values[1] ? formatValue(values[1], {
      generateConfig: generateConfig,
      locale: locale,
      format: formatList[0]
    }) : '';
    if (onCalendarChange) {
      var _info = {
        range: sourceIndex === 0 ? 'start' : 'end'
      };
      onCalendarChange(values, [startStr, endStr], _info);
    }

    // >>>>> Trigger `onChange` event
    var canStartValueTrigger = canValueTrigger(startValue, 0, mergedDisabled, allowEmpty);
    var canEndValueTrigger = canValueTrigger(endValue, 1, mergedDisabled, allowEmpty);
    var canTrigger = values === null || canStartValueTrigger && canEndValueTrigger;
    if (canTrigger) {
      // Trigger onChange only when value is validate
      setInnerValue(values);
      if (onChange && (!isEqual(generateConfig, getValue(mergedValue, 0), startValue) || !isEqual(generateConfig, getValue(mergedValue, 1), endValue))) {
        onChange(values, [startStr, endStr]);
      }
    }
  }
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

  // ============================= Text ==============================
  var sharedTextHooksProps = {
    formatList: formatList,
    generateConfig: generateConfig,
    locale: locale
  };
  var _useValueTexts = useValueTexts(getValue(selectedValue, 0), sharedTextHooksProps),
    _useValueTexts2 = _slicedToArray(_useValueTexts, 2),
    startValueTexts = _useValueTexts2[0],
    firstStartValueText = _useValueTexts2[1];
  var _useValueTexts3 = useValueTexts(getValue(selectedValue, 1), sharedTextHooksProps),
    _useValueTexts4 = _slicedToArray(_useValueTexts3, 2),
    endValueTexts = _useValueTexts4[0],
    firstEndValueText = _useValueTexts4[1];
  var _onTextChange = function onTextChange(newText, index) {
    var inputDate = parseValue(newText, {
      locale: locale,
      formatList: formatList,
      generateConfig: generateConfig
    });
    var disabledFunc = index === 0 ? disabledStartDate : disabledEndDate;
    if (inputDate && !disabledFunc(inputDate)) {
      setSelectedValue(updateValues(selectedValue, inputDate, index));
      setViewDate(inputDate, index);
    }
  };
  var _useTextValueMapping = useTextValueMapping({
      valueTexts: startValueTexts,
      onTextChange: function onTextChange(newText) {
        return _onTextChange(newText, 0);
      }
    }),
    _useTextValueMapping2 = _slicedToArray(_useTextValueMapping, 3),
    startText = _useTextValueMapping2[0],
    triggerStartTextChange = _useTextValueMapping2[1],
    resetStartText = _useTextValueMapping2[2];
  var _useTextValueMapping3 = useTextValueMapping({
      valueTexts: endValueTexts,
      onTextChange: function onTextChange(newText) {
        return _onTextChange(newText, 1);
      }
    }),
    _useTextValueMapping4 = _slicedToArray(_useTextValueMapping3, 3),
    endText = _useTextValueMapping4[0],
    triggerEndTextChange = _useTextValueMapping4[1],
    resetEndText = _useTextValueMapping4[2];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    rangeHoverValue = _useState4[0],
    setRangeHoverValue = _useState4[1];

  // ========================== Hover Range ==========================
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    hoverRangedValue = _useState6[0],
    setHoverRangedValue = _useState6[1];
  var _useHoverValue = useHoverValue(startText, {
      formatList: formatList,
      generateConfig: generateConfig,
      locale: locale
    }),
    _useHoverValue2 = _slicedToArray(_useHoverValue, 3),
    startHoverValue = _useHoverValue2[0],
    onStartEnter = _useHoverValue2[1],
    onStartLeave = _useHoverValue2[2];
  var _useHoverValue3 = useHoverValue(endText, {
      formatList: formatList,
      generateConfig: generateConfig,
      locale: locale
    }),
    _useHoverValue4 = _slicedToArray(_useHoverValue3, 3),
    endHoverValue = _useHoverValue4[0],
    onEndEnter = _useHoverValue4[1],
    onEndLeave = _useHoverValue4[2];
  var onDateMouseEnter = function onDateMouseEnter(date) {
    setHoverRangedValue(updateValues(selectedValue, date, mergedActivePickerIndex));
    if (mergedActivePickerIndex === 0) {
      onStartEnter(date);
    } else {
      onEndEnter(date);
    }
  };
  var onDateMouseLeave = function onDateMouseLeave() {
    setHoverRangedValue(updateValues(selectedValue, null, mergedActivePickerIndex));
    if (mergedActivePickerIndex === 0) {
      onStartLeave();
    } else {
      onEndLeave();
    }
  };

  // ============================= Input =============================
  // We call effect to update `delayOpen` here since
  // when popup closed and input focused, should not trigger change when click another input
  var _React$useState = React.useState(mergedOpen),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    delayOpen = _React$useState2[0],
    setDelayOpen = _React$useState2[1];
  React.useEffect(function () {
    setDelayOpen(mergedOpen);
  }, [mergedOpen]);
  var onInternalBlur = function onInternalBlur(e) {
    if (changeOnBlur && delayOpen) {
      var selectedIndexValue = getValue(selectedValue, mergedActivePickerIndex);
      if (selectedIndexValue) {
        triggerChange(selectedValue, mergedActivePickerIndex);
      }
    }
    return onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
  };
  var getSharedInputHookProps = function getSharedInputHookProps(index, resetText) {
    return {
      blurToCancel: !changeOnBlur && needConfirmButton,
      forwardKeyDown: forwardKeyDown,
      onBlur: onInternalBlur,
      isClickOutside: function isClickOutside(target) {
        return !elementsContains([panelDivRef.current, startInputDivRef.current, endInputDivRef.current, containerRef.current], target);
      },
      onFocus: function onFocus(e) {
        if (_onFocus) {
          _onFocus(e);
        }
      },
      triggerOpen: function triggerOpen(newOpen) {
        if (newOpen) {
          _triggerOpen(newOpen, index, 'open');
        } else {
          _triggerOpen(newOpen,
          // Close directly if no selected value provided
          getValue(selectedValue, index) ? index : false, 'blur');
        }
      },
      onSubmit: function onSubmit() {
        if (
        // When user typing disabledDate with keyboard and enter, this value will be empty
        !selectedValue ||
        // Normal disabled check
        disabledDate && disabledDate(selectedValue[index])) {
          return false;
        }
        triggerChange(selectedValue, index);
        resetText();

        // Switch
        _triggerOpen(false, mergedActivePickerIndex, 'confirm');
      },
      onCancel: function onCancel() {
        _triggerOpen(false, index, 'cancel');
        setSelectedValue(mergedValue);
        resetText();
      }
    };
  };
  var sharedPickerInput = {
    onKeyDown: function onKeyDown(e, preventDefault) {
      _onKeyDown === null || _onKeyDown === void 0 ? void 0 : _onKeyDown(e, preventDefault);
    },
    changeOnBlur: changeOnBlur
  };
  var _usePickerInput = usePickerInput(_objectSpread(_objectSpread({}, getSharedInputHookProps(0, resetStartText)), {}, {
      open: startOpen,
      value: startText
    }, sharedPickerInput)),
    _usePickerInput2 = _slicedToArray(_usePickerInput, 2),
    startInputProps = _usePickerInput2[0],
    _usePickerInput2$ = _usePickerInput2[1],
    startFocused = _usePickerInput2$.focused,
    startTyping = _usePickerInput2$.typing;
  var _usePickerInput3 = usePickerInput(_objectSpread(_objectSpread({}, getSharedInputHookProps(1, resetEndText)), {}, {
      open: endOpen,
      value: endText
    }, sharedPickerInput)),
    _usePickerInput4 = _slicedToArray(_usePickerInput3, 2),
    endInputProps = _usePickerInput4[0],
    _usePickerInput4$ = _usePickerInput4[1],
    endFocused = _usePickerInput4$.focused,
    endTyping = _usePickerInput4$.typing;

  // ========================== Click Picker ==========================
  var onPickerClick = function onPickerClick(e) {
    // When click inside the picker & outside the picker's input elements
    // the panel should still be opened
    if (onClick) {
      onClick(e);
    }
    if (!mergedOpen && !startInputRef.current.contains(e.target) && !endInputRef.current.contains(e.target)) {
      if (!mergedDisabled[0]) {
        triggerOpenAndFocus(0);
      } else if (!mergedDisabled[1]) {
        triggerOpenAndFocus(1);
      }
    }
  };
  var onPickerMouseDown = function onPickerMouseDown(e) {
    // shouldn't affect input elements if picker is active
    if (onMouseDown) {
      onMouseDown(e);
    }
    if (mergedOpen && (startFocused || endFocused) && !startInputRef.current.contains(e.target) && !endInputRef.current.contains(e.target)) {
      e.preventDefault();
    }
  };

  // ============================= Sync ==============================
  // Close should sync back with text value
  var startStr = mergedValue && mergedValue[0] ? formatValue(mergedValue[0], {
    locale: locale,
    format: 'YYYYMMDDHHmmss',
    generateConfig: generateConfig
  }) : '';
  var endStr = mergedValue && mergedValue[1] ? formatValue(mergedValue[1], {
    locale: locale,
    format: 'YYYYMMDDHHmmss',
    generateConfig: generateConfig
  }) : '';
  useEffect(function () {
    if (!mergedOpen) {
      setSelectedValue(mergedValue);
      if (!startValueTexts.length || startValueTexts[0] === '') {
        triggerStartTextChange('');
      } else if (firstStartValueText !== startText) {
        resetStartText();
      }
      if (!endValueTexts.length || endValueTexts[0] === '') {
        triggerEndTextChange('');
      } else if (firstEndValueText !== endText) {
        resetEndText();
      }
    }
  }, [mergedOpen, startValueTexts, endValueTexts]);

  // Sync innerValue with control mode
  useEffect(function () {
    setSelectedValue(mergedValue);
  }, [startStr, endStr]);
  var mergedCellRender = useCellRender({
    cellRender: cellRender,
    monthCellRender: monthCellRender,
    dateRender: dateRender
  });
  var panelDateRender = React.useMemo(function () {
    if (!mergedCellRender) return undefined;
    return function (date, info) {
      return mergedCellRender(date, _objectSpread(_objectSpread({}, info), {}, {
        range: mergedActivePickerIndex ? 'end' : 'start'
      }));
    };
  }, [mergedActivePickerIndex, mergedCellRender]);

  // ============================ Warning ============================
  if (process.env.NODE_ENV !== 'production') {
    if (value && Array.isArray(disabled) && (getValue(disabled, 0) && !getValue(value, 0) || getValue(disabled, 1) && !getValue(value, 1))) {
      warning(false, '`disabled` should not set with empty `value`. You should set `allowEmpty` or `value` instead.');
    }
    warning(!dateRender, "'dateRender' is deprecated. Please use 'cellRender' instead.");
    warning(!monthCellRender, "'monthCellRender' is deprecated. Please use 'cellRender' instead.");
    warning(!clearIcon, '`clearIcon` will be removed in future. Please use `allowClear` instead.');
  }

  // ============================ Private ============================
  if (pickerRef) {
    pickerRef.current = {
      focus: function focus() {
        if (startInputRef.current) {
          startInputRef.current.focus();
        }
      },
      blur: function blur() {
        if (startInputRef.current) {
          startInputRef.current.blur();
        }
        if (endInputRef.current) {
          endInputRef.current.blur();
        }
      }
    };
  }

  // ============================ Ranges =============================
  var presetList = usePresets(presets, ranges);

  // ============================= Panel =============================
  function renderPanel() {
    var panelPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var panelProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var panelHoverRangedValue = null;
    if (mergedOpen && hoverRangedValue && hoverRangedValue[0] && hoverRangedValue[1] && generateConfig.isAfter(hoverRangedValue[1], hoverRangedValue[0])) {
      panelHoverRangedValue = hoverRangedValue;
    }
    var panelShowTime = showTime;
    if (showTime && _typeof(showTime) === 'object' && showTime.defaultValue) {
      var timeDefaultValues = showTime.defaultValue;
      panelShowTime = _objectSpread(_objectSpread({}, showTime), {}, {
        defaultValue: getValue(timeDefaultValues, mergedActivePickerIndex) || undefined
      });
    }
    return /*#__PURE__*/React.createElement(RangeContext.Provider, {
      value: {
        inRange: true,
        panelPosition: panelPosition,
        rangedValue: rangeHoverValue || selectedValue,
        hoverRangedValue: panelHoverRangedValue
      }
    }, /*#__PURE__*/React.createElement(PickerPanel, _extends({}, props, panelProps, {
      cellRender: panelDateRender,
      showTime: panelShowTime,
      mode: mergedModes[mergedActivePickerIndex],
      generateConfig: generateConfig,
      style: undefined,
      direction: direction,
      disabledDate: mergedActivePickerIndex === 0 ? disabledStartDate : disabledEndDate,
      disabledTime: function disabledTime(date) {
        if (_disabledTime) {
          return _disabledTime(date, mergedActivePickerIndex === 0 ? 'start' : 'end');
        }
        return false;
      },
      className: classNames(_defineProperty({}, "".concat(prefixCls, "-panel-focused"), mergedActivePickerIndex === 0 ? !startTyping : !endTyping)),
      value: getValue(selectedValue, mergedActivePickerIndex),
      locale: locale,
      tabIndex: -1,
      onPanelChange: function onPanelChange(date, newMode) {
        // clear hover value when panel change
        if (mergedActivePickerIndex === 0) {
          onStartLeave(true);
        }
        if (mergedActivePickerIndex === 1) {
          onEndLeave(true);
        }
        triggerModesChange(updateValues(mergedModes, newMode, mergedActivePickerIndex), updateValues(selectedValue, date, mergedActivePickerIndex));
        var viewDate = date;
        if (panelPosition === 'right' && mergedModes[mergedActivePickerIndex] === newMode) {
          viewDate = getClosingViewDate(viewDate, newMode, generateConfig, -1);
        }
        setViewDate(viewDate, mergedActivePickerIndex);
      },
      onOk: null,
      onSelect: undefined,
      onChange: undefined,
      defaultValue: mergedActivePickerIndex === 0 ? getValue(selectedValue, 1) : getValue(selectedValue, 0)
      // defaultPickerValue={undefined}
    })));
  }

  var arrowLeft = 0;
  var panelLeft = 0;
  if (mergedActivePickerIndex && startInputDivRef.current && separatorRef.current && panelDivRef.current && arrowRef.current) {
    // Arrow offset
    arrowLeft = startInputDivRef.current.offsetWidth + separatorRef.current.offsetWidth;

    // If panelWidth - arrowWidth - arrowMarginLeft < arrowLeft, panel should move to right side.
    // If arrowOffsetLeft > arrowLeft, arrowMarginLeft = arrowOffsetLeft - arrowLeft
    var arrowMarginLeft = arrowRef.current.offsetLeft > arrowLeft ? arrowRef.current.offsetLeft - arrowLeft : arrowRef.current.offsetLeft;
    var panelWidth = panelDivRef.current.offsetWidth;
    var arrowWidth = arrowRef.current.offsetWidth;
    if (panelWidth && arrowWidth && arrowLeft > panelWidth - arrowWidth - (direction === 'rtl' ? 0 : arrowMarginLeft)) {
      panelLeft = arrowLeft;
    }
  }
  var arrowPositionStyle = direction === 'rtl' ? {
    right: arrowLeft
  } : {
    left: arrowLeft
  };
  function renderPanels() {
    var panels;
    var extraNode = getExtraFooter(prefixCls, mergedModes[mergedActivePickerIndex], renderExtraFooter);
    var rangesNode = getRanges({
      prefixCls: prefixCls,
      components: components,
      needConfirmButton: needConfirmButton,
      okDisabled: !getValue(selectedValue, mergedActivePickerIndex) || disabledDate && disabledDate(selectedValue[mergedActivePickerIndex]),
      locale: locale,
      // rangeList,
      onOk: function onOk() {
        var selectedIndexValue = getValue(selectedValue, mergedActivePickerIndex);
        if (selectedIndexValue) {
          triggerChange(selectedValue, mergedActivePickerIndex);
          _onOk === null || _onOk === void 0 ? void 0 : _onOk(selectedValue);

          // Switch
          _triggerOpen(false, mergedActivePickerIndex, 'confirm');
        }
      }
    });
    if (picker !== 'time' && !showTime) {
      var viewDate = getViewDate(mergedActivePickerIndex);
      var nextViewDate = getClosingViewDate(viewDate, picker, generateConfig);
      var currentMode = mergedModes[mergedActivePickerIndex];
      var showDoublePanel = currentMode === picker;
      var leftPanel = renderPanel(showDoublePanel ? 'left' : false, {
        pickerValue: viewDate,
        onPickerValueChange: function onPickerValueChange(newViewDate) {
          setViewDate(newViewDate, mergedActivePickerIndex);
        }
      });
      var rightPanel = renderPanel('right', {
        pickerValue: nextViewDate,
        onPickerValueChange: function onPickerValueChange(newViewDate) {
          setViewDate(getClosingViewDate(newViewDate, picker, generateConfig, -1), mergedActivePickerIndex);
        }
      });
      if (direction === 'rtl') {
        panels = /*#__PURE__*/React.createElement(React.Fragment, null, rightPanel, showDoublePanel && leftPanel);
      } else {
        panels = /*#__PURE__*/React.createElement(React.Fragment, null, leftPanel, showDoublePanel && rightPanel);
      }
    } else {
      panels = renderPanel();
    }
    var mergedNodes = /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-panel-layout")
    }, /*#__PURE__*/React.createElement(PresetPanel, {
      prefixCls: prefixCls,
      presets: presetList,
      onClick: function onClick(nextValue) {
        triggerChange(nextValue, null);
        _triggerOpen(false, mergedActivePickerIndex, 'preset');
      },
      onHover: function onHover(hoverValue) {
        setRangeHoverValue(hoverValue);
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-panels")
    }, panels), (extraNode || rangesNode) && /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-footer")
    }, extraNode, rangesNode)));
    if (panelRender) {
      mergedNodes = panelRender(mergedNodes);
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-panel-container"),
      style: {
        marginLeft: panelLeft
      },
      ref: panelDivRef,
      onMouseDown: function onMouseDown(e) {
        e.preventDefault();
      }
    }, mergedNodes);
  }
  var rangePanel = /*#__PURE__*/React.createElement("div", {
    className: classNames("".concat(prefixCls, "-range-wrapper"), "".concat(prefixCls, "-").concat(picker, "-range-wrapper")),
    style: {
      minWidth: popupMinWidth
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: arrowRef,
    className: "".concat(prefixCls, "-range-arrow"),
    style: arrowPositionStyle
  }), renderPanels());

  // ============================= Icons =============================
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
  var mergedClearIcon = getClearIcon(prefixCls, allowClear, clearIcon);
  var clearNode = /*#__PURE__*/React.createElement("span", {
    onMouseDown: function onMouseDown(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    onMouseUp: function onMouseUp(e) {
      e.preventDefault();
      e.stopPropagation();
      var values = mergedValue;
      if (!mergedDisabled[0]) {
        values = updateValues(values, null, 0);
      }
      if (!mergedDisabled[1]) {
        values = updateValues(values, null, 1);
      }
      triggerChange(values, null);
      _triggerOpen(false, mergedActivePickerIndex, 'clear');
    },
    className: "".concat(prefixCls, "-clear"),
    role: "button"
  }, mergedClearIcon);
  var mergedAllowClear = allowClear && (getValue(mergedValue, 0) && !mergedDisabled[0] || getValue(mergedValue, 1) && !mergedDisabled[1]);
  var inputSharedProps = {
    size: getInputSize(picker, formatList[0], generateConfig)
  };
  var activeBarLeft = 0;
  var activeBarWidth = 0;
  if (startInputDivRef.current && endInputDivRef.current && separatorRef.current) {
    if (mergedActivePickerIndex === 0) {
      activeBarWidth = startInputDivRef.current.offsetWidth;
    } else {
      activeBarLeft = arrowLeft;
      activeBarWidth = endInputDivRef.current.offsetWidth;
    }
  }
  var activeBarPositionStyle = direction === 'rtl' ? {
    right: activeBarLeft
  } : {
    left: activeBarLeft
  };
  // ============================ Return =============================
  var onContextSelect = function onContextSelect(date, type) {
    var values = updateValues(selectedValue, date, mergedActivePickerIndex);
    if (type === 'submit' || type !== 'key' && !needConfirmButton) {
      // triggerChange will also update selected values
      triggerChange(values, mergedActivePickerIndex);
      // clear hover value style
      if (mergedActivePickerIndex === 0) {
        onStartLeave();
      } else {
        onEndLeave();
      }

      // Switch
      var nextActivePickerIndex = mergedActivePickerIndex === 0 ? 1 : 0;
      if (mergedDisabled[nextActivePickerIndex]) {
        _triggerOpen(false, false, 'confirm');
      } else {
        _triggerOpen(false, mergedActivePickerIndex, 'confirm');
      }
    } else {
      setSelectedValue(values);
    }
  };
  return /*#__PURE__*/React.createElement(PanelContext.Provider, {
    value: {
      operationRef: operationRef,
      hideHeader: picker === 'time',
      onDateMouseEnter: onDateMouseEnter,
      onDateMouseLeave: onDateMouseLeave,
      hideRanges: true,
      onSelect: onContextSelect,
      open: mergedOpen
    }
  }, /*#__PURE__*/React.createElement(PickerTrigger, {
    visible: mergedOpen,
    popupElement: rangePanel,
    popupStyle: popupStyle,
    prefixCls: prefixCls,
    dropdownClassName: dropdownClassName,
    dropdownAlign: dropdownAlign,
    getPopupContainer: getPopupContainer,
    transitionName: transitionName,
    range: true,
    direction: direction
  }, /*#__PURE__*/React.createElement("div", _extends({
    ref: containerRef,
    className: classNames(prefixCls, "".concat(prefixCls, "-range"), className, (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-disabled"), mergedDisabled[0] && mergedDisabled[1]), _defineProperty(_classNames2, "".concat(prefixCls, "-focused"), mergedActivePickerIndex === 0 ? startFocused : endFocused), _defineProperty(_classNames2, "".concat(prefixCls, "-rtl"), direction === 'rtl'), _classNames2)),
    style: style,
    onClick: onPickerClick,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onMouseDown: onPickerMouseDown,
    onMouseUp: onMouseUp
  }, pickAttrs(props, {
    aria: true,
    data: true
  })), /*#__PURE__*/React.createElement("div", {
    className: classNames("".concat(prefixCls, "-input"), (_classNames3 = {}, _defineProperty(_classNames3, "".concat(prefixCls, "-input-active"), mergedActivePickerIndex === 0), _defineProperty(_classNames3, "".concat(prefixCls, "-input-placeholder"), !!startHoverValue), _classNames3)),
    ref: startInputDivRef
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    disabled: mergedDisabled[0],
    readOnly: inputReadOnly || typeof formatList[0] === 'function' || !startTyping,
    value: startHoverValue || startText,
    onChange: function onChange(e) {
      triggerStartTextChange(e.target.value);
    },
    autoFocus: autoFocus,
    placeholder: getValue(placeholder, 0) || '',
    ref: startInputRef
  }, startInputProps, inputSharedProps, {
    autoComplete: autoComplete
  }))), /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-range-separator"),
    ref: separatorRef
  }, separator), /*#__PURE__*/React.createElement("div", {
    className: classNames("".concat(prefixCls, "-input"), (_classNames4 = {}, _defineProperty(_classNames4, "".concat(prefixCls, "-input-active"), mergedActivePickerIndex === 1), _defineProperty(_classNames4, "".concat(prefixCls, "-input-placeholder"), !!endHoverValue), _classNames4)),
    ref: endInputDivRef
  }, /*#__PURE__*/React.createElement("input", _extends({
    disabled: mergedDisabled[1],
    readOnly: inputReadOnly || typeof formatList[0] === 'function' || !endTyping,
    value: endHoverValue || endText,
    onChange: function onChange(e) {
      triggerEndTextChange(e.target.value);
    },
    placeholder: getValue(placeholder, 1) || '',
    ref: endInputRef
  }, endInputProps, inputSharedProps, {
    autoComplete: autoComplete
  }))), /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-active-bar"),
    style: _objectSpread(_objectSpread({}, activeBarPositionStyle), {}, {
      width: activeBarWidth,
      position: 'absolute'
    })
  }), suffixNode, mergedAllowClear && clearNode)));
}

// Wrap with class component to enable pass generic with instance method
var RangePicker = /*#__PURE__*/function (_React$Component) {
  _inherits(RangePicker, _React$Component);
  var _super = _createSuper(RangePicker);
  function RangePicker() {
    var _this;
    _classCallCheck(this, RangePicker);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
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
  _createClass(RangePicker, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(InnerRangePicker, _extends({}, this.props, {
        pickerRef: this.pickerRef
      }));
    }
  }]);
  return RangePicker;
}(React.Component);
export default RangePicker;