import { resetComponent } from '../../style';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
const genBaseStyle = token => {
  const {
    antCls,
    componentCls,
    iconCls,
    avatarBg,
    avatarColor,
    containerSize,
    containerSizeLG,
    containerSizeSM,
    textFontSize,
    textFontSizeLG,
    textFontSizeSM,
    borderRadius,
    borderRadiusLG,
    borderRadiusSM,
    lineWidth,
    lineType
  } = token;
  // Avatar size style
  const avatarSizeStyle = (size, fontSize, radius) => ({
    width: size,
    height: size,
    lineHeight: `${size - lineWidth * 2}px`,
    borderRadius: '50%',
    [`&${componentCls}-square`]: {
      borderRadius: radius
    },
    [`${componentCls}-string`]: {
      position: 'absolute',
      left: {
        _skip_check_: true,
        value: '50%'
      },
      transformOrigin: '0 center'
    },
    [`&${componentCls}-icon`]: {
      fontSize,
      [`> ${iconCls}`]: {
        margin: 0
      }
    }
  });
  return {
    [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), {
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden',
      color: avatarColor,
      whiteSpace: 'nowrap',
      textAlign: 'center',
      verticalAlign: 'middle',
      background: avatarBg,
      border: `${lineWidth}px ${lineType} transparent`,
      [`&-image`]: {
        background: 'transparent'
      },
      [`${antCls}-image-img`]: {
        display: 'block'
      }
    }), avatarSizeStyle(containerSize, textFontSize, borderRadius)), {
      [`&-lg`]: Object.assign({}, avatarSizeStyle(containerSizeLG, textFontSizeLG, borderRadiusLG)),
      [`&-sm`]: Object.assign({}, avatarSizeStyle(containerSizeSM, textFontSizeSM, borderRadiusSM)),
      '> img': {
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    })
  };
};
const genGroupStyle = token => {
  const {
    componentCls,
    groupBorderColor,
    groupOverlapping,
    groupSpace
  } = token;
  return {
    [`${componentCls}-group`]: {
      display: 'inline-flex',
      [`${componentCls}`]: {
        borderColor: groupBorderColor
      },
      [`> *:not(:first-child)`]: {
        marginInlineStart: groupOverlapping
      }
    },
    [`${componentCls}-group-popover`]: {
      [`${componentCls} + ${componentCls}`]: {
        marginInlineStart: groupSpace
      }
    }
  };
};
export default genComponentStyleHook('Avatar', token => {
  const {
    colorTextLightSolid,
    colorTextPlaceholder
  } = token;
  const avatarToken = mergeToken(token, {
    avatarBg: colorTextPlaceholder,
    avatarColor: colorTextLightSolid
  });
  return [genBaseStyle(avatarToken), genGroupStyle(avatarToken)];
}, token => {
  const {
    controlHeight,
    controlHeightLG,
    controlHeightSM,
    fontSize,
    fontSizeLG,
    fontSizeXL,
    fontSizeHeading3,
    marginXS,
    marginXXS,
    colorBorderBg
  } = token;
  return {
    containerSize: controlHeight,
    containerSizeLG: controlHeightLG,
    containerSizeSM: controlHeightSM,
    textFontSize: Math.round((fontSizeLG + fontSizeXL) / 2),
    textFontSizeLG: fontSizeHeading3,
    textFontSizeSM: fontSize,
    groupSpace: marginXXS,
    groupOverlapping: -marginXS,
    groupBorderColor: colorBorderBg
  };
});