import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import useCellClassName from "../../hooks/useCellClassName";
import RangeContext from "../../RangeContext";
import { formatValue, getWeekStartDate, isSameDate, isSameMonth, WEEK_DAY_COUNT } from "../../utils/dateUtil";
import PanelBody from "../PanelBody";
function DateBody(props) {
  var prefixCls = props.prefixCls,
    generateConfig = props.generateConfig,
    prefixColumn = props.prefixColumn,
    locale = props.locale,
    rowCount = props.rowCount,
    viewDate = props.viewDate,
    value = props.value,
    cellRender = props.cellRender,
    isSameCell = props.isSameCell;
  var _React$useContext = React.useContext(RangeContext),
    rangedValue = _React$useContext.rangedValue,
    hoverRangedValue = _React$useContext.hoverRangedValue;
  var baseDate = getWeekStartDate(locale.locale, generateConfig, viewDate);
  var cellPrefixCls = "".concat(prefixCls, "-cell");
  var weekFirstDay = generateConfig.locale.getWeekFirstDay(locale.locale);
  var today = generateConfig.getNow();

  // ============================== Header ==============================
  var headerCells = [];
  var weekDaysLocale = locale.shortWeekDays || (generateConfig.locale.getShortWeekDays ? generateConfig.locale.getShortWeekDays(locale.locale) : []);
  if (prefixColumn) {
    headerCells.push( /*#__PURE__*/React.createElement("th", {
      key: "empty",
      "aria-label": "empty cell"
    }));
  }
  for (var i = 0; i < WEEK_DAY_COUNT; i += 1) {
    headerCells.push( /*#__PURE__*/React.createElement("th", {
      key: i
    }, weekDaysLocale[(i + weekFirstDay) % WEEK_DAY_COUNT]));
  }

  // =============================== Body ===============================
  var getCellClassName = useCellClassName({
    cellPrefixCls: cellPrefixCls,
    today: today,
    value: value,
    generateConfig: generateConfig,
    rangedValue: prefixColumn ? null : rangedValue,
    hoverRangedValue: prefixColumn ? null : hoverRangedValue,
    isSameCell: isSameCell || function (current, target) {
      return isSameDate(generateConfig, current, target);
    },
    isInView: function isInView(date) {
      return isSameMonth(generateConfig, date, viewDate);
    },
    offsetCell: function offsetCell(date, offset) {
      return generateConfig.addDate(date, offset);
    }
  });
  var getCellNode = cellRender ? function (date, wrapperNode) {
    return cellRender(date, {
      originNode: wrapperNode,
      today: today,
      type: 'date',
      locale: locale
    });
  } : undefined;
  return /*#__PURE__*/React.createElement(PanelBody, _extends({}, props, {
    rowNum: rowCount,
    colNum: WEEK_DAY_COUNT,
    baseDate: baseDate,
    getCellNode: getCellNode,
    getCellText: generateConfig.getDate,
    getCellClassName: getCellClassName,
    getCellDate: generateConfig.addDate,
    titleCell: function titleCell(date) {
      return formatValue(date, {
        locale: locale,
        format: 'YYYY-MM-DD',
        generateConfig: generateConfig
      });
    },
    headerCells: headerCells
  }));
}
export default DateBody;