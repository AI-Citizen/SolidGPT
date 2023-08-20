import { ColorBlock, Color as RcColor } from '@rc-component/color-picker';
import classNames from 'classnames';
import useMergedState from "rc-util/es/hooks/useMergedState";
import React, { useMemo } from 'react';
import Collapse from '../../collapse';
import { useLocale } from '../../locale';
import theme from '../../theme';
import { generateColor } from '../util';
const genPresetColor = list => list.map(value => {
  value.colors = value.colors.map(generateColor);
  return value;
});
const isBright = (value, bgColorToken) => {
  const {
    r,
    g,
    b,
    a
  } = value.toRgb();
  const hsv = new RcColor(value.toRgbString()).onBackground(bgColorToken).toHsv();
  if (a <= 0.5) {
    // Adapted to dark mode
    return hsv.v > 0.5;
  }
  return r * 0.299 + g * 0.587 + b * 0.114 > 192;
};
const ColorPresets = _ref => {
  let {
    prefixCls,
    presets,
    value: color,
    onChange
  } = _ref;
  const [locale] = useLocale('ColorPicker');
  const {
    token: {
      colorBgElevated
    }
  } = theme.useToken();
  const [presetsValue] = useMergedState(genPresetColor(presets), {
    value: genPresetColor(presets),
    postState: genPresetColor
  });
  const colorPresetsPrefixCls = `${prefixCls}-presets`;
  const activeKeys = useMemo(() => presetsValue.map(preset => `panel-${preset.label}`), [presetsValue]);
  const handleClick = colorValue => {
    onChange === null || onChange === void 0 ? void 0 : onChange(colorValue);
  };
  const items = presetsValue.map(preset => {
    var _a;
    return {
      key: `panel-${preset.label}`,
      label: /*#__PURE__*/React.createElement("div", {
        className: `${colorPresetsPrefixCls}-label`
      }, preset === null || preset === void 0 ? void 0 : preset.label),
      children: /*#__PURE__*/React.createElement("div", {
        className: `${colorPresetsPrefixCls}-items`
      }, Array.isArray(preset === null || preset === void 0 ? void 0 : preset.colors) && ((_a = preset.colors) === null || _a === void 0 ? void 0 : _a.length) > 0 ? preset.colors.map(presetColor => /*#__PURE__*/React.createElement(ColorBlock, {
        key: `preset-${presetColor.toHexString()}`,
        color: generateColor(presetColor).toRgbString(),
        prefixCls: prefixCls,
        className: classNames(`${colorPresetsPrefixCls}-color`, {
          [`${colorPresetsPrefixCls}-color-checked`]: presetColor.toHexString() === (color === null || color === void 0 ? void 0 : color.toHexString()),
          [`${colorPresetsPrefixCls}-color-bright`]: isBright(presetColor, colorBgElevated)
        }),
        onClick: () => handleClick(presetColor)
      })) : /*#__PURE__*/React.createElement("span", {
        className: `${colorPresetsPrefixCls}-empty`
      }, locale.presetEmpty))
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    className: colorPresetsPrefixCls
  }, /*#__PURE__*/React.createElement(Collapse, {
    defaultActiveKey: activeKeys,
    ghost: true,
    items: items
  }));
};
export default ColorPresets;