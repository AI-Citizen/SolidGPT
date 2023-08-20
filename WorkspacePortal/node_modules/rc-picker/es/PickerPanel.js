import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
/**
 * Logic:
 *  When `mode` === `picker`,
 *  click will trigger `onSelect` (if value changed trigger `onChange` also).
 *  Panel change will not trigger `onSelect` but trigger `onPanelChange`
 */

import classNames from 'classnames';
import useMergedState from "rc-util/es/hooks/useMergedState";
import KeyCode from "rc-util/es/KeyCode";
import warning from "rc-util/es/warning";
import * as React from 'react';
import { useCellRender } from "./hooks/useCellRender";
import PanelContext from "./PanelContext";
import DatePanel from "./panels/DatePanel";
import DatetimePanel from "./panels/DatetimePanel";
import DecadePanel from "./panels/DecadePanel";
import MonthPanel from "./panels/MonthPanel";
import { MONTH_COL_COUNT } from "./panels/MonthPanel/MonthBody";
import QuarterPanel from "./panels/QuarterPanel";
import TimePanel from "./panels/TimePanel";
import WeekPanel from "./panels/WeekPanel";
import YearPanel from "./panels/YearPanel";
import RangeContext from "./RangeContext";
import { isEqual, WEEK_DAY_COUNT } from "./utils/dateUtil";
import getExtraFooter from "./utils/getExtraFooter";
import getRanges from "./utils/getRanges";
import { getLowerBoundTime, setDateTime, setTime } from "./utils/timeUtil";
import { PickerModeMap } from "./utils/uiUtil";

// TMP type to fit for ts 3.9.2

// Calendar picker type
var CALENDAR_PANEL_MODE = ['date', 'month'];
function PickerPanel(props) {
  var _classNames;
  var _ref = props,
    _ref$prefixCls = _ref.prefixCls,
    prefixCls = _ref$prefixCls === void 0 ? 'rc-picker' : _ref$prefixCls,
    className = _ref.className,
    style = _ref.style,
    locale = _ref.locale,
    generateConfig = _ref.generateConfig,
    value = _ref.value,
    defaultValue = _ref.defaultValue,
    pickerValue = _ref.pickerValue,
    defaultPickerValue = _ref.defaultPickerValue,
    disabledDate = _ref.disabledDate,
    mode = _ref.mode,
    _ref$picker = _ref.picker,
    picker = _ref$picker === void 0 ? 'date' : _ref$picker,
    _ref$tabIndex = _ref.tabIndex,
    tabIndex = _ref$tabIndex === void 0 ? 0 : _ref$tabIndex,
    showNow = _ref.showNow,
    showTime = _ref.showTime,
    showToday = _ref.showToday,
    renderExtraFooter = _ref.renderExtraFooter,
    hideHeader = _ref.hideHeader,
    onSelect = _ref.onSelect,
    onChange = _ref.onChange,
    onPanelChange = _ref.onPanelChange,
    onMouseDown = _ref.onMouseDown,
    onPickerValueChange = _ref.onPickerValueChange,
    _onOk = _ref.onOk,
    components = _ref.components,
    direction = _ref.direction,
    _ref$hourStep = _ref.hourStep,
    hourStep = _ref$hourStep === void 0 ? 1 : _ref$hourStep,
    _ref$minuteStep = _ref.minuteStep,
    minuteStep = _ref$minuteStep === void 0 ? 1 : _ref$minuteStep,
    _ref$secondStep = _ref.secondStep,
    secondStep = _ref$secondStep === void 0 ? 1 : _ref$secondStep,
    dateRender = _ref.dateRender,
    monthCellRender = _ref.monthCellRender,
    cellRender = _ref.cellRender;
  var needConfirmButton = picker === 'date' && !!showTime || picker === 'time';
  var isHourStepValid = 24 % hourStep === 0;
  var isMinuteStepValid = 60 % minuteStep === 0;
  var isSecondStepValid = 60 % secondStep === 0;
  if (process.env.NODE_ENV !== 'production') {
    warning(!value || generateConfig.isValidate(value), 'Invalidate date pass to `value`.');
    warning(!value || generateConfig.isValidate(value), 'Invalidate date pass to `defaultValue`.');
    warning(isHourStepValid, "`hourStep` ".concat(hourStep, " is invalid. It should be a factor of 24."));
    warning(isMinuteStepValid, "`minuteStep` ".concat(minuteStep, " is invalid. It should be a factor of 60."));
    warning(isSecondStepValid, "`secondStep` ".concat(secondStep, " is invalid. It should be a factor of 60."));
    warning(!dateRender, "'dateRender' is deprecated. Please use 'cellRender' instead.");
    warning(!monthCellRender, "'monthCellRender' is deprecated. Please use 'cellRender' instead.");
  }

  // ============================ State =============================

  var panelContext = React.useContext(PanelContext);
  var operationRef = panelContext.operationRef,
    onContextSelect = panelContext.onSelect,
    hideRanges = panelContext.hideRanges,
    defaultOpenValue = panelContext.defaultOpenValue;
  var _React$useContext = React.useContext(RangeContext),
    inRange = _React$useContext.inRange,
    panelPosition = _React$useContext.panelPosition,
    rangedValue = _React$useContext.rangedValue,
    hoverRangedValue = _React$useContext.hoverRangedValue;
  var panelRef = React.useRef({});

  // Handle init logic
  var initRef = React.useRef(true);

  // Value
  var _useMergedState = useMergedState(null, {
      value: value,
      defaultValue: defaultValue,
      postState: function postState(val) {
        if (!val && defaultOpenValue && picker === 'time') {
          return defaultOpenValue;
        }
        return val;
      }
    }),
    _useMergedState2 = _slicedToArray(_useMergedState, 2),
    mergedValue = _useMergedState2[0],
    setInnerValue = _useMergedState2[1];

  // View date control
  var _useMergedState3 = useMergedState(null, {
      value: pickerValue,
      defaultValue: defaultPickerValue || mergedValue,
      postState: function postState(date) {
        var now = generateConfig.getNow();
        if (!date) {
          return now;
        }
        // When value is null and set showTime
        if (!mergedValue && showTime) {
          var defaultDateObject = _typeof(showTime) === 'object' ? showTime.defaultValue : defaultValue;
          return setDateTime(generateConfig, Array.isArray(date) ? date[0] : date, defaultDateObject || now);
        }
        return Array.isArray(date) ? date[0] : date;
      }
    }),
    _useMergedState4 = _slicedToArray(_useMergedState3, 2),
    viewDate = _useMergedState4[0],
    setInnerViewDate = _useMergedState4[1];
  var setViewDate = function setViewDate(date) {
    setInnerViewDate(date);
    if (onPickerValueChange) {
      onPickerValueChange(date);
    }
  };

  // Panel control
  var getInternalNextMode = function getInternalNextMode(nextMode) {
    var getNextMode = PickerModeMap[picker];
    if (getNextMode) {
      return getNextMode(nextMode);
    }
    return nextMode;
  };

  // Save panel is changed from which panel
  var _useMergedState5 = useMergedState(function () {
      if (picker === 'time') {
        return 'time';
      }
      return getInternalNextMode('date');
    }, {
      value: mode
    }),
    _useMergedState6 = _slicedToArray(_useMergedState5, 2),
    mergedMode = _useMergedState6[0],
    setInnerMode = _useMergedState6[1];
  React.useEffect(function () {
    setInnerMode(picker);
  }, [picker]);
  var _React$useState = React.useState(function () {
      return mergedMode;
    }),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    sourceMode = _React$useState2[0],
    setSourceMode = _React$useState2[1];
  var onInternalPanelChange = function onInternalPanelChange(newMode, viewValue) {
    var nextMode = getInternalNextMode(newMode || mergedMode);
    setSourceMode(mergedMode);
    setInnerMode(nextMode);
    if (onPanelChange && (mergedMode !== nextMode || isEqual(generateConfig, viewDate, viewDate))) {
      onPanelChange(viewValue, nextMode);
    }
  };
  var triggerSelect = function triggerSelect(date, type) {
    var forceTriggerSelect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (mergedMode === picker || forceTriggerSelect) {
      setInnerValue(date);
      if (onSelect) {
        onSelect(date);
      }
      if (onContextSelect) {
        onContextSelect(date, type);
      }
      if (onChange && !isEqual(generateConfig, date, mergedValue) && !(disabledDate !== null && disabledDate !== void 0 && disabledDate(date))) {
        onChange(date);
      }
    }
  };
  var isSelectable = function isSelectable(key) {
    if (CALENDAR_PANEL_MODE.includes(mergedMode)) {
      var _date;
      var operationFnc;
      var isDateMode = mergedMode === 'date';
      if (key === KeyCode.PAGE_UP || key === KeyCode.PAGE_DOWN) {
        operationFnc = isDateMode ? generateConfig.addMonth : generateConfig.addYear;
      } else {
        operationFnc = isDateMode ? generateConfig.addDate : generateConfig.addMonth;
      }
      switch (key) {
        case KeyCode.LEFT:
        case KeyCode.PAGE_UP:
          _date = operationFnc(viewDate, -1);
          break;
        case KeyCode.RIGHT:
        case KeyCode.PAGE_DOWN:
          _date = operationFnc(viewDate, 1);
          break;
        case KeyCode.UP:
        case KeyCode.DOWN:
          _date = operationFnc(viewDate, Number("".concat(key === KeyCode.UP ? '-' : '').concat(isDateMode ? WEEK_DAY_COUNT : MONTH_COL_COUNT)));
          break;
      }
      if (_date) {
        return !(disabledDate !== null && disabledDate !== void 0 && disabledDate(_date));
      }
    }
    return true;
  };

  // ========================= Interactive ==========================
  var onInternalKeyDown = function onInternalKeyDown(e) {
    if (panelRef.current && panelRef.current.onKeyDown) {
      var selectable = true;
      var which = e.which;
      if ([KeyCode.LEFT, KeyCode.RIGHT, KeyCode.UP, KeyCode.DOWN, KeyCode.PAGE_UP, KeyCode.PAGE_DOWN, KeyCode.ENTER].includes(which)) {
        e.preventDefault();
        if (which !== KeyCode.ENTER && tabIndex === 0) {
          selectable = isSelectable(which);
        }
      }

      // Cannot use keyboard to select disabled date
      if (selectable) {
        return panelRef.current.onKeyDown(e);
      }
    }

    /* istanbul ignore next */
    /* eslint-disable no-lone-blocks */
    {
      warning(false, 'Panel not correct handle keyDown event. Please help to fire issue about this.');
      return false;
    }
    /* eslint-enable no-lone-blocks */
  };

  var onInternalBlur = function onInternalBlur(e) {
    if (panelRef.current && panelRef.current.onBlur) {
      panelRef.current.onBlur(e);
    }
  };
  if (operationRef && panelPosition !== 'right') {
    operationRef.current = {
      onKeyDown: onInternalKeyDown,
      onClose: function onClose() {
        if (panelRef.current && panelRef.current.onClose) {
          panelRef.current.onClose();
        }
      }
    };
  }

  // ============================ Effect ============================
  React.useEffect(function () {
    if (value && !initRef.current) {
      setInnerViewDate(value);
    }
  }, [value]);
  React.useEffect(function () {
    initRef.current = false;
  }, []);

  // ============================ Panels ============================
  var panelNode;
  var mergedCellRender = useCellRender({
    cellRender: cellRender,
    monthCellRender: monthCellRender,
    dateRender: dateRender
  });
  var pickerProps = _objectSpread(_objectSpread({}, props), {}, {
    cellRender: mergedCellRender,
    operationRef: panelRef,
    prefixCls: prefixCls,
    viewDate: viewDate,
    value: mergedValue,
    onViewDateChange: setViewDate,
    sourceMode: sourceMode,
    onPanelChange: onInternalPanelChange,
    disabledDate: disabledDate
  });
  delete pickerProps.onChange;
  delete pickerProps.onSelect;
  switch (mergedMode) {
    case 'decade':
      panelNode = /*#__PURE__*/React.createElement(DecadePanel, _extends({}, pickerProps, {
        onSelect: function onSelect(date, type) {
          setViewDate(date);
          triggerSelect(date, type);
        }
      }));
      break;
    case 'year':
      panelNode = /*#__PURE__*/React.createElement(YearPanel, _extends({}, pickerProps, {
        onSelect: function onSelect(date, type) {
          setViewDate(date);
          triggerSelect(date, type);
        }
      }));
      break;
    case 'month':
      panelNode = /*#__PURE__*/React.createElement(MonthPanel, _extends({}, pickerProps, {
        onSelect: function onSelect(date, type) {
          setViewDate(date);
          triggerSelect(date, type);
        }
      }));
      break;
    case 'quarter':
      panelNode = /*#__PURE__*/React.createElement(QuarterPanel, _extends({}, pickerProps, {
        onSelect: function onSelect(date, type) {
          setViewDate(date);
          triggerSelect(date, type);
        }
      }));
      break;
    case 'week':
      panelNode = /*#__PURE__*/React.createElement(WeekPanel, _extends({}, pickerProps, {
        onSelect: function onSelect(date, type) {
          setViewDate(date);
          triggerSelect(date, type);
        }
      }));
      break;
    case 'time':
      delete pickerProps.showTime;
      panelNode = /*#__PURE__*/React.createElement(TimePanel, _extends({}, pickerProps, _typeof(showTime) === 'object' ? showTime : null, {
        onSelect: function onSelect(date, type) {
          setViewDate(date);
          triggerSelect(date, type);
        }
      }));
      break;
    default:
      if (showTime) {
        panelNode = /*#__PURE__*/React.createElement(DatetimePanel, _extends({}, pickerProps, {
          onSelect: function onSelect(date, type) {
            setViewDate(date);
            triggerSelect(date, type);
          }
        }));
      } else {
        panelNode = /*#__PURE__*/React.createElement(DatePanel, _extends({}, pickerProps, {
          onSelect: function onSelect(date, type) {
            setViewDate(date);
            triggerSelect(date, type);
          }
        }));
      }
  }

  // ============================ Footer ============================
  var extraFooter;
  var rangesNode;
  var onNow = function onNow() {
    var now = generateConfig.getNow();
    var lowerBoundTime = getLowerBoundTime(generateConfig.getHour(now), generateConfig.getMinute(now), generateConfig.getSecond(now), isHourStepValid ? hourStep : 1, isMinuteStepValid ? minuteStep : 1, isSecondStepValid ? secondStep : 1);
    var adjustedNow = setTime(generateConfig, now, lowerBoundTime[0],
    // hour
    lowerBoundTime[1],
    // minute
    lowerBoundTime[2] // second
    );

    triggerSelect(adjustedNow, 'submit');
  };
  if (!hideRanges) {
    extraFooter = getExtraFooter(prefixCls, mergedMode, renderExtraFooter);

    // This content is not displayed when the header switches year and month
    if (showTime && mergedMode !== 'date') {
      rangesNode = null;
    } else {
      rangesNode = getRanges({
        prefixCls: prefixCls,
        components: components,
        needConfirmButton: needConfirmButton,
        okDisabled: !mergedValue || disabledDate && disabledDate(mergedValue),
        locale: locale,
        showNow: showNow,
        onNow: needConfirmButton && onNow,
        onOk: function onOk() {
          if (mergedValue) {
            triggerSelect(mergedValue, 'submit', true);
            if (_onOk) {
              _onOk(mergedValue);
            }
          }
        }
      });
    }
  }
  var todayNode;
  if (showToday && mergedMode === 'date' && picker === 'date' && !showTime) {
    var now = generateConfig.getNow();
    var todayCls = "".concat(prefixCls, "-today-btn");
    var disabled = disabledDate && disabledDate(now);
    todayNode = /*#__PURE__*/React.createElement("a", {
      className: classNames(todayCls, disabled && "".concat(todayCls, "-disabled")),
      "aria-disabled": disabled,
      onClick: function onClick() {
        if (!disabled) {
          triggerSelect(now, 'mouse', true);
        }
      }
    }, locale.today);
  }
  return /*#__PURE__*/React.createElement(PanelContext.Provider, {
    value: _objectSpread(_objectSpread({}, panelContext), {}, {
      mode: mergedMode,
      hideHeader: 'hideHeader' in props ? hideHeader : panelContext.hideHeader,
      hidePrevBtn: inRange && panelPosition === 'right',
      hideNextBtn: inRange && panelPosition === 'left'
    })
  }, /*#__PURE__*/React.createElement("div", {
    tabIndex: tabIndex,
    className: classNames("".concat(prefixCls, "-panel"), className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-panel-has-range"), rangedValue && rangedValue[0] && rangedValue[1]), _defineProperty(_classNames, "".concat(prefixCls, "-panel-has-range-hover"), hoverRangedValue && hoverRangedValue[0] && hoverRangedValue[1]), _defineProperty(_classNames, "".concat(prefixCls, "-panel-rtl"), direction === 'rtl'), _classNames)),
    style: style,
    onKeyDown: onInternalKeyDown,
    onBlur: onInternalBlur,
    onMouseDown: onMouseDown
  }, panelNode, extraFooter || rangesNode || todayNode ? /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-footer")
  }, extraFooter, rangesNode, todayNode) : null));
}
export default PickerPanel;
/* eslint-enable */