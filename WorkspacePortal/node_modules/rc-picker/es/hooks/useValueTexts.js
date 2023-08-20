import useMemo from "rc-util/es/hooks/useMemo";
import shallowEqual from "rc-util/es/isEqual";
import { formatValue, isEqual } from "../utils/dateUtil";
export default function useValueTexts(value, _ref) {
  var formatList = _ref.formatList,
    generateConfig = _ref.generateConfig,
    locale = _ref.locale;
  return useMemo(function () {
    if (!value) {
      return [[''], ''];
    }

    // We will convert data format back to first format
    var firstValueText = '';
    var fullValueTexts = [];
    for (var i = 0; i < formatList.length; i += 1) {
      var format = formatList[i];
      var formatStr = formatValue(value, {
        generateConfig: generateConfig,
        locale: locale,
        format: format
      });
      fullValueTexts.push(formatStr);
      if (i === 0) {
        firstValueText = formatStr;
      }
    }
    return [fullValueTexts, firstValueText];
  }, [value, formatList], function (prev, next) {
    return (
      // Not Same Date
      !isEqual(generateConfig, prev[0], next[0]) ||
      // Not Same format
      !shallowEqual(prev[1], next[1], true)
    );
  });
}