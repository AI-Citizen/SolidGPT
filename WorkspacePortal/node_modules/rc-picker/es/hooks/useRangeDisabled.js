import * as React from 'react';
import { getQuarter, isSameDate } from "../utils/dateUtil";
import { getValue } from "../utils/miscUtil";
export default function useRangeDisabled(_ref, firstTimeOpen) {
  var picker = _ref.picker,
    locale = _ref.locale,
    selectedValue = _ref.selectedValue,
    disabledDate = _ref.disabledDate,
    disabled = _ref.disabled,
    generateConfig = _ref.generateConfig;
  var startDate = getValue(selectedValue, 0);
  var endDate = getValue(selectedValue, 1);
  function weekFirstDate(date) {
    return generateConfig.locale.getWeekFirstDate(locale.locale, date);
  }
  function monthNumber(date) {
    var year = generateConfig.getYear(date);
    var month = generateConfig.getMonth(date);
    return year * 100 + month;
  }
  function quarterNumber(date) {
    var year = generateConfig.getYear(date);
    var quarter = getQuarter(generateConfig, date);
    return year * 10 + quarter;
  }
  var disabledStartDate = React.useCallback(function (date) {
    if (disabled[0] || disabledDate && disabledDate(date)) {
      return true;
    }

    // Disabled range
    if (disabled[1] && endDate) {
      return !isSameDate(generateConfig, date, endDate) && generateConfig.isAfter(date, endDate);
    }

    // Disabled part
    if (!firstTimeOpen && endDate) {
      switch (picker) {
        case 'quarter':
          return quarterNumber(date) > quarterNumber(endDate);
        case 'month':
          return monthNumber(date) > monthNumber(endDate);
        case 'week':
          return weekFirstDate(date) > weekFirstDate(endDate);
        default:
          return !isSameDate(generateConfig, date, endDate) && generateConfig.isAfter(date, endDate);
      }
    }
    return false;
  }, [disabledDate, disabled[1], endDate, firstTimeOpen]);
  var disabledEndDate = React.useCallback(function (date) {
    if (disabled[1] || disabledDate && disabledDate(date)) {
      return true;
    }

    // Disabled range
    if (disabled[0] && startDate) {
      return !isSameDate(generateConfig, date, endDate) && generateConfig.isAfter(startDate, date);
    }

    // Disabled part
    if (!firstTimeOpen && startDate) {
      switch (picker) {
        case 'quarter':
          return quarterNumber(date) < quarterNumber(startDate);
        case 'month':
          return monthNumber(date) < monthNumber(startDate);
        case 'week':
          return weekFirstDate(date) < weekFirstDate(startDate);
        default:
          return !isSameDate(generateConfig, date, startDate) && generateConfig.isAfter(startDate, date);
      }
    }
    return false;
  }, [disabledDate, disabled[0], startDate, firstTimeOpen]);
  return [disabledStartDate, disabledEndDate];
}