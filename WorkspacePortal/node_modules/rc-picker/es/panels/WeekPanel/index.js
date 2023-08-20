import _extends from "@babel/runtime/helpers/esm/extends";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import classNames from 'classnames';
import * as React from 'react';
import PanelContext from "../../PanelContext";
import RangeContext from "../../RangeContext";
import { getCellDateDisabled, isInRange, isSameWeek } from "../../utils/dateUtil";
import DatePanel from "../DatePanel";
function WeekPanel(props) {
  var prefixCls = props.prefixCls,
    generateConfig = props.generateConfig,
    locale = props.locale,
    value = props.value,
    disabledDate = props.disabledDate,
    onSelect = props.onSelect;
  var _React$useContext = React.useContext(RangeContext),
    rangedValue = _React$useContext.rangedValue,
    hoverRangedValue = _React$useContext.hoverRangedValue;
  var _React$useContext2 = React.useContext(PanelContext),
    onDateMouseEnter = _React$useContext2.onDateMouseEnter,
    onDateMouseLeave = _React$useContext2.onDateMouseLeave;
  var rangeStart = (hoverRangedValue === null || hoverRangedValue === void 0 ? void 0 : hoverRangedValue[0]) || (rangedValue === null || rangedValue === void 0 ? void 0 : rangedValue[0]);
  var rangeEnd = (hoverRangedValue === null || hoverRangedValue === void 0 ? void 0 : hoverRangedValue[1]) || (rangedValue === null || rangedValue === void 0 ? void 0 : rangedValue[1]);

  // Render additional column
  var cellPrefixCls = "".concat(prefixCls, "-cell");
  var prefixColumn = function prefixColumn(date) {
    // >>> Additional check for disabled
    var disabled = getCellDateDisabled({
      cellDate: date,
      mode: 'week',
      disabledDate: disabledDate,
      generateConfig: generateConfig
    });
    return /*#__PURE__*/React.createElement("td", {
      key: "week",
      className: classNames(cellPrefixCls, "".concat(cellPrefixCls, "-week"))
      // Operation: Same as code in PanelBody
      ,
      onClick: function onClick() {
        if (!disabled) {
          onSelect(date, 'mouse');
        }
      },
      onMouseEnter: function onMouseEnter() {
        if (!disabled && onDateMouseEnter) {
          onDateMouseEnter(date);
        }
      },
      onMouseLeave: function onMouseLeave() {
        if (!disabled && onDateMouseLeave) {
          onDateMouseLeave(date);
        }
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "".concat(cellPrefixCls, "-inner")
    }, generateConfig.locale.getWeek(locale.locale, date)));
  };

  // Add row className
  var rowPrefixCls = "".concat(prefixCls, "-week-panel-row");
  var rowClassName = function rowClassName(date) {
    var _classNames;
    var isRangeStart = isSameWeek(generateConfig, locale.locale, rangeStart, date);
    var isRangeEnd = isSameWeek(generateConfig, locale.locale, rangeEnd, date);
    return classNames(rowPrefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(rowPrefixCls, "-selected"), !rangedValue && isSameWeek(generateConfig, locale.locale, value, date)), _defineProperty(_classNames, "".concat(rowPrefixCls, "-range-start"), isRangeStart), _defineProperty(_classNames, "".concat(rowPrefixCls, "-range-end"), isRangeEnd), _defineProperty(_classNames, "".concat(rowPrefixCls, "-range-hover"), !isRangeStart && !isRangeEnd && isInRange(generateConfig, rangeStart, rangeEnd, date)), _classNames));
  };
  return /*#__PURE__*/React.createElement(DatePanel, _extends({}, props, {
    panelName: "week",
    prefixColumn: prefixColumn,
    rowClassName: rowClassName,
    keyboardConfig: {
      onLeftRight: null
    }
    // No need check cell level
    ,
    isSameCell: function isSameCell() {
      return false;
    }
  }));
}
export default WeekPanel;