import React from 'react';
export function useCellRender(_ref) {
  var cellRender = _ref.cellRender,
    monthCellRender = _ref.monthCellRender,
    dateRender = _ref.dateRender;
  var mergedCellRender = React.useMemo(function () {
    if (cellRender) return cellRender;
    if (!monthCellRender && !dateRender) return undefined;
    return function (current, info) {
      var date = current;
      if (dateRender && info.type === 'date') {
        return dateRender(date, info.today);
      }
      if (monthCellRender && info.type === 'month') {
        return monthCellRender(date, info.locale);
      }
      return info.originNode;
    };
  }, [cellRender, monthCellRender, dateRender]);
  return mergedCellRender;
}