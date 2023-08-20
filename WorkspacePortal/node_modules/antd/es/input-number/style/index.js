import { genActiveStyle, genBasicInputStyle, genDisabledStyle, genHoverStyle, genInputGroupStyle, genPlaceholderStyle, genStatusStyle, initInputToken } from '../../input/style';
import { resetComponent, resetIcon } from '../../style';
import { genCompactItemStyle } from '../../style/compact-item';
import { genComponentStyleHook } from '../../theme/internal';
export const genRadiusStyle = (_ref, size) => {
  let {
    componentCls,
    borderRadiusSM,
    borderRadiusLG
  } = _ref;
  const borderRadius = size === 'lg' ? borderRadiusLG : borderRadiusSM;
  return {
    [`&-${size}`]: {
      [`${componentCls}-handler-wrap`]: {
        borderStartEndRadius: borderRadius,
        borderEndEndRadius: borderRadius
      },
      [`${componentCls}-handler-up`]: {
        borderStartEndRadius: borderRadius
      },
      [`${componentCls}-handler-down`]: {
        borderEndEndRadius: borderRadius
      }
    }
  };
};
const genInputNumberStyles = token => {
  const {
    componentCls,
    lineWidth,
    lineType,
    colorBorder,
    borderRadius,
    fontSizeLG,
    controlHeightLG,
    controlHeightSM,
    colorError,
    inputPaddingHorizontalSM,
    colorTextDescription,
    motionDurationMid,
    colorPrimary,
    inputPaddingHorizontal,
    inputPaddingVertical,
    colorBgContainer,
    colorTextDisabled,
    borderRadiusSM,
    borderRadiusLG,
    controlWidth,
    handleVisible
  } = token;
  return [{
    [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), genBasicInputStyle(token)), genStatusStyle(token, componentCls)), {
      display: 'inline-block',
      width: controlWidth,
      margin: 0,
      padding: 0,
      border: `${lineWidth}px ${lineType} ${colorBorder}`,
      borderRadius,
      '&-rtl': {
        direction: 'rtl',
        [`${componentCls}-input`]: {
          direction: 'rtl'
        }
      },
      '&-lg': {
        padding: 0,
        fontSize: fontSizeLG,
        borderRadius: borderRadiusLG,
        [`input${componentCls}-input`]: {
          height: controlHeightLG - 2 * lineWidth
        }
      },
      '&-sm': {
        padding: 0,
        borderRadius: borderRadiusSM,
        [`input${componentCls}-input`]: {
          height: controlHeightSM - 2 * lineWidth,
          padding: `0 ${inputPaddingHorizontalSM}px`
        }
      },
      '&:hover': Object.assign({}, genHoverStyle(token)),
      '&-focused': Object.assign({}, genActiveStyle(token)),
      // ===================== Out Of Range =====================
      '&-out-of-range': {
        [`${componentCls}-input-wrap`]: {
          input: {
            color: colorError
          }
        }
      },
      // Style for input-group: input with label, with button or dropdown...
      '&-group': Object.assign(Object.assign(Object.assign({}, resetComponent(token)), genInputGroupStyle(token)), {
        '&-wrapper': {
          display: 'inline-block',
          textAlign: 'start',
          verticalAlign: 'top',
          [`${componentCls}-affix-wrapper`]: {
            width: '100%'
          },
          // Size
          '&-lg': {
            [`${componentCls}-group-addon`]: {
              borderRadius: borderRadiusLG,
              fontSize: token.fontSizeLG
            }
          },
          '&-sm': {
            [`${componentCls}-group-addon`]: {
              borderRadius: borderRadiusSM
            }
          },
          [`${componentCls}-wrapper-disabled > ${componentCls}-group-addon`]: Object.assign({}, genDisabledStyle(token))
        }
      }),
      [`&-disabled ${componentCls}-input`]: {
        cursor: 'not-allowed'
      },
      [componentCls]: {
        '&-input': Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), {
          width: '100%',
          padding: `${inputPaddingVertical}px ${inputPaddingHorizontal}px`,
          textAlign: 'start',
          backgroundColor: 'transparent',
          border: 0,
          borderRadius,
          outline: 0,
          transition: `all ${motionDurationMid} linear`,
          appearance: 'textfield',
          fontSize: 'inherit'
        }), genPlaceholderStyle(token.colorTextPlaceholder)), {
          '&[type="number"]::-webkit-inner-spin-button, &[type="number"]::-webkit-outer-spin-button': {
            margin: 0,
            /* stylelint-disable-next-line property-no-vendor-prefix */
            webkitAppearance: 'none',
            appearance: 'none'
          }
        })
      }
    })
  },
  // Handler
  {
    [componentCls]: Object.assign(Object.assign(Object.assign({
      [`&:hover ${componentCls}-handler-wrap, &-focused ${componentCls}-handler-wrap`]: {
        opacity: 1
      },
      [`${componentCls}-handler-wrap`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineEnd: 0,
        width: token.handleWidth,
        height: '100%',
        background: colorBgContainer,
        borderStartStartRadius: 0,
        borderStartEndRadius: borderRadius,
        borderEndEndRadius: borderRadius,
        borderEndStartRadius: 0,
        opacity: handleVisible === true ? 1 : 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        transition: `opacity ${motionDurationMid} linear ${motionDurationMid}`,
        // Fix input number inside Menu makes icon too large
        // We arise the selector priority by nest selector here
        // https://github.com/ant-design/ant-design/issues/14367
        [`${componentCls}-handler`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'auto',
          height: '40%',
          [`
              ${componentCls}-handler-up-inner,
              ${componentCls}-handler-down-inner
            `]: {
            marginInlineEnd: 0,
            fontSize: token.handleFontSize
          }
        }
      },
      [`${componentCls}-handler`]: {
        height: '50%',
        overflow: 'hidden',
        color: colorTextDescription,
        fontWeight: 'bold',
        lineHeight: 0,
        textAlign: 'center',
        cursor: 'pointer',
        borderInlineStart: `${lineWidth}px ${lineType} ${colorBorder}`,
        transition: `all ${motionDurationMid} linear`,
        '&:active': {
          background: token.colorFillAlter
        },
        // Hover
        '&:hover': {
          height: `60%`,
          [`
              ${componentCls}-handler-up-inner,
              ${componentCls}-handler-down-inner
            `]: {
            color: colorPrimary
          }
        },
        '&-up-inner, &-down-inner': Object.assign(Object.assign({}, resetIcon()), {
          color: colorTextDescription,
          transition: `all ${motionDurationMid} linear`,
          userSelect: 'none'
        })
      },
      [`${componentCls}-handler-up`]: {
        borderStartEndRadius: borderRadius
      },
      [`${componentCls}-handler-down`]: {
        borderBlockStart: `${lineWidth}px ${lineType} ${colorBorder}`,
        borderEndEndRadius: borderRadius
      }
    }, genRadiusStyle(token, 'lg')), genRadiusStyle(token, 'sm')), {
      // Disabled
      '&-disabled, &-readonly': {
        [`${componentCls}-handler-wrap`]: {
          display: 'none'
        },
        [`${componentCls}-input`]: {
          color: 'inherit'
        }
      },
      [`
          ${componentCls}-handler-up-disabled,
          ${componentCls}-handler-down-disabled
        `]: {
        cursor: 'not-allowed'
      },
      [`
          ${componentCls}-handler-up-disabled:hover &-handler-up-inner,
          ${componentCls}-handler-down-disabled:hover &-handler-down-inner
        `]: {
        color: colorTextDisabled
      }
    })
  },
  // Border-less
  {
    [`${componentCls}-borderless`]: {
      borderColor: 'transparent',
      boxShadow: 'none',
      [`${componentCls}-handler-down`]: {
        borderBlockStartWidth: 0
      }
    }
  }];
};
const genAffixWrapperStyles = token => {
  const {
    componentCls,
    inputPaddingVertical,
    inputPaddingHorizontal,
    inputAffixPadding,
    controlWidth,
    borderRadiusLG,
    borderRadiusSM
  } = token;
  return {
    [`${componentCls}-affix-wrapper`]: Object.assign(Object.assign(Object.assign({}, genBasicInputStyle(token)), genStatusStyle(token, `${componentCls}-affix-wrapper`)), {
      // or number handler will cover form status
      position: 'relative',
      display: 'inline-flex',
      width: controlWidth,
      padding: 0,
      paddingInlineStart: inputPaddingHorizontal,
      '&-lg': {
        borderRadius: borderRadiusLG
      },
      '&-sm': {
        borderRadius: borderRadiusSM
      },
      [`&:not(${componentCls}-affix-wrapper-disabled):hover`]: Object.assign(Object.assign({}, genHoverStyle(token)), {
        zIndex: 1
      }),
      '&-focused, &:focus': {
        zIndex: 1
      },
      [`&-disabled > ${componentCls}-disabled`]: {
        background: 'transparent'
      },
      [`> div${componentCls}`]: {
        width: '100%',
        border: 'none',
        outline: 'none',
        [`&${componentCls}-focused`]: {
          boxShadow: 'none !important'
        }
      },
      [`input${componentCls}-input`]: {
        padding: `${inputPaddingVertical}px 0`
      },
      '&::before': {
        display: 'inline-block',
        width: 0,
        visibility: 'hidden',
        content: '"\\a0"'
      },
      [`${componentCls}-handler-wrap`]: {
        zIndex: 2
      },
      [componentCls]: {
        '&-prefix, &-suffix': {
          display: 'flex',
          flex: 'none',
          alignItems: 'center',
          pointerEvents: 'none'
        },
        '&-prefix': {
          marginInlineEnd: inputAffixPadding
        },
        '&-suffix': {
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineEnd: 0,
          zIndex: 1,
          height: '100%',
          marginInlineEnd: inputPaddingHorizontal,
          marginInlineStart: inputAffixPadding
        }
      }
    })
  };
};
// ============================== Export ==============================
export default genComponentStyleHook('InputNumber', token => {
  const inputNumberToken = initInputToken(token);
  return [genInputNumberStyles(inputNumberToken), genAffixWrapperStyles(inputNumberToken),
  // =====================================================
  // ==             Space Compact                       ==
  // =====================================================
  genCompactItemStyle(inputNumberToken)];
}, token => ({
  controlWidth: 90,
  handleWidth: token.controlHeightSM - token.lineWidth * 2,
  handleFontSize: token.fontSize / 2,
  handleVisible: 'auto'
}));