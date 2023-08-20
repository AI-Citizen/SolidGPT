import { resetComponent, textEllipsis } from '../../style';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
// ============================== Mixins ==============================
function getItemDisabledStyle(cls, token) {
  return {
    [`${cls}, ${cls}:hover, ${cls}:focus`]: {
      color: token.colorTextDisabled,
      cursor: 'not-allowed'
    }
  };
}
function getItemSelectedStyle(token) {
  return {
    backgroundColor: token.itemSelectedBg,
    boxShadow: token.boxShadowTertiary
  };
}
const segmentedTextEllipsisCss = Object.assign({
  overflow: 'hidden'
}, textEllipsis);
// ============================== Styles ==============================
const genSegmentedStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), {
      display: 'inline-block',
      padding: token.segmentedPadding,
      color: token.itemColor,
      backgroundColor: token.segmentedBgColor,
      borderRadius: token.borderRadius,
      transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
      [`${componentCls}-group`]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyItems: 'flex-start',
        width: '100%'
      },
      // RTL styles
      [`&${componentCls}-rtl`]: {
        direction: 'rtl'
      },
      // block styles
      [`&${componentCls}-block`]: {
        display: 'flex'
      },
      [`&${componentCls}-block ${componentCls}-item`]: {
        flex: 1,
        minWidth: 0
      },
      // item styles
      [`${componentCls}-item`]: {
        position: 'relative',
        textAlign: 'center',
        cursor: 'pointer',
        transition: `color ${token.motionDurationMid} ${token.motionEaseInOut}`,
        borderRadius: token.borderRadiusSM,
        '&-selected': Object.assign(Object.assign({}, getItemSelectedStyle(token)), {
          color: token.itemHoverColor
        }),
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          insetInlineStart: 0,
          borderRadius: 'inherit',
          transition: `background-color ${token.motionDurationMid}`,
          // This is mandatory to make it not clickable or hoverable
          // Ref: https://github.com/ant-design/ant-design/issues/40888
          pointerEvents: 'none'
        },
        [`&:hover:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)`]: {
          color: token.itemHoverColor,
          '&::after': {
            backgroundColor: token.itemHoverBg
          }
        },
        [`&:active:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)`]: {
          color: token.itemHoverColor,
          '&::after': {
            backgroundColor: token.itemActiveBg
          }
        },
        '&-label': Object.assign({
          minHeight: token.controlHeight - token.segmentedPadding * 2,
          lineHeight: `${token.controlHeight - token.segmentedPadding * 2}px`,
          padding: `0 ${token.segmentedPaddingHorizontal}px`
        }, segmentedTextEllipsisCss),
        // syntactic sugar to add `icon` for Segmented Item
        '&-icon + *': {
          marginInlineStart: token.marginSM / 2
        },
        '&-input': {
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineStart: 0,
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none'
        }
      },
      // thumb styles
      [`${componentCls}-thumb`]: Object.assign(Object.assign({}, getItemSelectedStyle(token)), {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        width: 0,
        height: '100%',
        padding: `${token.paddingXXS}px 0`,
        borderRadius: token.borderRadiusSM,
        [`& ~ ${componentCls}-item:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)::after`]: {
          backgroundColor: 'transparent'
        }
      }),
      // size styles
      [`&${componentCls}-lg`]: {
        borderRadius: token.borderRadiusLG,
        [`${componentCls}-item-label`]: {
          minHeight: token.controlHeightLG - token.segmentedPadding * 2,
          lineHeight: `${token.controlHeightLG - token.segmentedPadding * 2}px`,
          padding: `0 ${token.segmentedPaddingHorizontal}px`,
          fontSize: token.fontSizeLG
        },
        [`${componentCls}-item, ${componentCls}-thumb`]: {
          borderRadius: token.borderRadius
        }
      },
      [`&${componentCls}-sm`]: {
        borderRadius: token.borderRadiusSM,
        [`${componentCls}-item-label`]: {
          minHeight: token.controlHeightSM - token.segmentedPadding * 2,
          lineHeight: `${token.controlHeightSM - token.segmentedPadding * 2}px`,
          padding: `0 ${token.segmentedPaddingHorizontalSM}px`
        },
        [`${componentCls}-item, ${componentCls}-thumb`]: {
          borderRadius: token.borderRadiusXS
        }
      }
    }), getItemDisabledStyle(`&-disabled ${componentCls}-item`, token)), getItemDisabledStyle(`${componentCls}-item-disabled`, token)), {
      // transition effect when `appear-active`
      [`${componentCls}-thumb-motion-appear-active`]: {
        transition: `transform ${token.motionDurationSlow} ${token.motionEaseInOut}, width ${token.motionDurationSlow} ${token.motionEaseInOut}`,
        willChange: 'transform, width'
      }
    })
  };
};
// ============================== Export ==============================
export default genComponentStyleHook('Segmented', token => {
  const {
    lineWidth,
    lineWidthBold,
    colorBgLayout
  } = token;
  const segmentedToken = mergeToken(token, {
    segmentedPadding: lineWidthBold,
    segmentedBgColor: colorBgLayout,
    segmentedPaddingHorizontal: token.controlPaddingHorizontal - lineWidth,
    segmentedPaddingHorizontalSM: token.controlPaddingHorizontalSM - lineWidth
  });
  return [genSegmentedStyle(segmentedToken)];
}, token => {
  const {
    colorTextLabel,
    colorText,
    colorFillSecondary,
    colorBgElevated,
    colorFill
  } = token;
  return {
    itemColor: colorTextLabel,
    itemHoverColor: colorText,
    itemHoverBg: colorFillSecondary,
    itemSelectedBg: colorBgElevated,
    itemActiveBg: colorFill
  };
});