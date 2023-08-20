import useMemo from "rc-util/es/hooks/useMemo";
import isEqual from "rc-util/es/isEqual";
import { getCellFixedInfo } from "../utils/fixUtil";
export default function useFixedInfo(flattenColumns, stickyOffsets, direction, columns) {
  var fixedInfoList = flattenColumns.map(function (_, colIndex) {
    return getCellFixedInfo(colIndex, colIndex, flattenColumns, stickyOffsets, direction, columns === null || columns === void 0 ? void 0 : columns[colIndex]);
  });
  return useMemo(function () {
    return fixedInfoList;
  }, [fixedInfoList], function (prev, next) {
    return !isEqual(prev, next);
  });
}