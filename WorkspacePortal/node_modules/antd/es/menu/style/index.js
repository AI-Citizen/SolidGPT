import { TinyColor } from '@ctrl/tinycolor';
import { clearFix, resetComponent, resetIcon } from '../../style';
import { genCollapseMotion, initSlideMotion, initZoomMotion } from '../../style/motion';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import getHorizontalStyle from './horizontal';
import getRTLStyle from './rtl';
import getThemeStyle from './theme';
import getVerticalStyle from './vertical';
const genMenuItemStyle = token => {
  const {
    componentCls,
    motionDurationSlow,
    motionDurationMid,
    motionEaseInOut,
    motionEaseOut,
    iconCls,
    iconSize,
    iconMarginInlineEnd
  } = token;
  return {
    // >>>>> Item
    [`${componentCls}-item, ${componentCls}-submenu-title`]: {
      position: 'relative',
      display: 'block',
      margin: 0,
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      transition: [`border-color ${motionDurationSlow}`, `background ${motionDurationSlow}`, `padding ${motionDurationSlow} ${motionEaseInOut}`].join(','),
      [`${componentCls}-item-icon, ${iconCls}`]: {
        minWidth: iconSize,
        fontSize: iconSize,
        transition: [`font-size ${motionDurationMid} ${motionEaseOut}`, `margin ${motionDurationSlow} ${motionEaseInOut}`, `color ${motionDurationSlow}`].join(','),
        '+ span': {
          marginInlineStart: iconMarginInlineEnd,
          opacity: 1,
          transition: [`opacity ${motionDurationSlow} ${motionEaseInOut}`, `margin ${motionDurationSlow}`, `color ${motionDurationSlow}`].join(',')
        }
      },
      [`${componentCls}-item-icon`]: Object.assign({}, resetIcon()),
      [`&${componentCls}-item-only-child`]: {
        [`> ${iconCls}, > ${componentCls}-item-icon`]: {
          marginInlineEnd: 0
        }
      }
    },
    // Disabled state sets text to gray and nukes hover/tab effects
    [`${componentCls}-item-disabled, ${componentCls}-submenu-disabled`]: {
      background: 'none !important',
      cursor: 'not-allowed',
      '&::after': {
        borderColor: 'transparent !important'
      },
      a: {
        color: 'inherit !important'
      },
      [`> ${componentCls}-submenu-title`]: {
        color: 'inherit !important',
        cursor: 'not-allowed'
      }
    }
  };
};
const genSubMenuArrowStyle = token => {
  const {
    componentCls,
    motionDurationSlow,
    motionEaseInOut,
    borderRadius,
    menuArrowSize,
    menuArrowOffset
  } = token;
  return {
    [`${componentCls}-submenu`]: {
      [`&-expand-icon, &-arrow`]: {
        position: 'absolute',
        top: '50%',
        insetInlineEnd: token.margin,
        width: menuArrowSize,
        color: 'currentcolor',
        transform: 'translateY(-50%)',
        transition: `transform ${motionDurationSlow} ${motionEaseInOut}, opacity ${motionDurationSlow}`
      },
      '&-arrow': {
        // →
        '&::before, &::after': {
          position: 'absolute',
          width: menuArrowSize * 0.6,
          height: menuArrowSize * 0.15,
          backgroundColor: 'currentcolor',
          borderRadius,
          transition: [`background ${motionDurationSlow} ${motionEaseInOut}`, `transform ${motionDurationSlow} ${motionEaseInOut}`, `top ${motionDurationSlow} ${motionEaseInOut}`, `color ${motionDurationSlow} ${motionEaseInOut}`].join(','),
          content: '""'
        },
        '&::before': {
          transform: `rotate(45deg) translateY(-${menuArrowOffset})`
        },
        '&::after': {
          transform: `rotate(-45deg) translateY(${menuArrowOffset})`
        }
      }
    }
  };
};
// =============================== Base ===============================
const getBaseStyle = token => {
  const {
    antCls,
    componentCls,
    fontSize,
    motionDurationSlow,
    motionDurationMid,
    motionEaseInOut,
    paddingXS,
    padding,
    colorSplit,
    lineWidth,
    zIndexPopup,
    borderRadiusLG,
    subMenuItemBorderRadius,
    menuArrowSize,
    menuArrowOffset,
    lineType,
    menuPanelMaskInset,
    groupTitleLineHeight,
    groupTitleFontSize
  } = token;
  return [
  // Misc
  {
    '': {
      [`${componentCls}`]: Object.assign(Object.assign({}, clearFix()), {
        // Hidden
        [`&-hidden`]: {
          display: 'none'
        }
      })
    },
    [`${componentCls}-submenu-hidden`]: {
      display: 'none'
    }
  }, {
    [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), clearFix()), {
      marginBottom: 0,
      paddingInlineStart: 0,
      // Override default ul/ol
      fontSize,
      lineHeight: 0,
      listStyle: 'none',
      outline: 'none',
      // Magic cubic here but smooth transition
      transition: `width ${motionDurationSlow} cubic-bezier(0.2, 0, 0, 1) 0s`,
      [`ul, ol`]: {
        margin: 0,
        padding: 0,
        listStyle: 'none'
      },
      // Overflow ellipsis
      [`&-overflow`]: {
        display: 'flex',
        [`${componentCls}-item`]: {
          flex: 'none'
        }
      },
      [`${componentCls}-item, ${componentCls}-submenu, ${componentCls}-submenu-title`]: {
        borderRadius: token.itemBorderRadius
      },
      [`${componentCls}-item-group-title`]: {
        padding: `${paddingXS}px ${padding}px`,
        fontSize: groupTitleFontSize,
        lineHeight: groupTitleLineHeight,
        transition: `all ${motionDurationSlow}`
      },
      [`&-horizontal ${componentCls}-submenu`]: {
        transition: [`border-color ${motionDurationSlow} ${motionEaseInOut}`, `background ${motionDurationSlow} ${motionEaseInOut}`].join(',')
      },
      [`${componentCls}-submenu, ${componentCls}-submenu-inline`]: {
        transition: [`border-color ${motionDurationSlow} ${motionEaseInOut}`, `background ${motionDurationSlow} ${motionEaseInOut}`, `padding ${motionDurationMid} ${motionEaseInOut}`].join(',')
      },
      [`${componentCls}-submenu ${componentCls}-sub`]: {
        cursor: 'initial',
        transition: [`background ${motionDurationSlow} ${motionEaseInOut}`, `padding ${motionDurationSlow} ${motionEaseInOut}`].join(',')
      },
      [`${componentCls}-title-content`]: {
        transition: `color ${motionDurationSlow}`
      },
      [`${componentCls}-item a`]: {
        '&::before': {
          position: 'absolute',
          inset: 0,
          backgroundColor: 'transparent',
          content: '""'
        }
      },
      // Removed a Badge related style seems it's safe
      // https://github.com/ant-design/ant-design/issues/19809
      // >>>>> Divider
      [`${componentCls}-item-divider`]: {
        overflow: 'hidden',
        lineHeight: 0,
        borderColor: colorSplit,
        borderStyle: lineType,
        borderWidth: 0,
        borderTopWidth: lineWidth,
        marginBlock: lineWidth,
        padding: 0,
        '&-dashed': {
          borderStyle: 'dashed'
        }
      }
    }), genMenuItemStyle(token)), {
      [`${componentCls}-item-group`]: {
        [`${componentCls}-item-group-list`]: {
          margin: 0,
          padding: 0,
          [`${componentCls}-item, ${componentCls}-submenu-title`]: {
            paddingInline: `${fontSize * 2}px ${padding}px`
          }
        }
      },
      // ======================= Sub Menu =======================
      '&-submenu': {
        '&-popup': {
          position: 'absolute',
          zIndex: zIndexPopup,
          borderRadius: borderRadiusLG,
          boxShadow: 'none',
          transformOrigin: '0 0',
          [`&${componentCls}-submenu`]: {
            background: 'transparent'
          },
          // https://github.com/ant-design/ant-design/issues/13955
          '&::before': {
            position: 'absolute',
            inset: `${menuPanelMaskInset}px 0 0`,
            zIndex: -1,
            width: '100%',
            height: '100%',
            opacity: 0,
            content: '""'
          }
        },
        // https://github.com/ant-design/ant-design/issues/13955
        '&-placement-rightTop::before': {
          top: 0,
          insetInlineStart: menuPanelMaskInset
        },
        [`
          &-placement-leftTop,
          &-placement-bottomRight,
          `]: {
          transformOrigin: '100% 0'
        },
        [`
          &-placement-leftBottom,
          &-placement-topRight,
          `]: {
          transformOrigin: '100% 100%'
        },
        [`
          &-placement-rightBottom,
          &-placement-topLeft,
          `]: {
          transformOrigin: '0 100%'
        },
        [`
          &-placement-bottomLeft,
          &-placement-rightTop,
          `]: {
          transformOrigin: '0 0'
        },
        [`
          &-placement-leftTop,
          &-placement-leftBottom
          `]: {
          paddingInlineEnd: token.paddingXS
        },
        [`
          &-placement-rightTop,
          &-placement-rightBottom
          `]: {
          paddingInlineStart: token.paddingXS
        },
        [`
          &-placement-topRight,
          &-placement-topLeft
          `]: {
          paddingBottom: token.paddingXS
        },
        [`
          &-placement-bottomRight,
          &-placement-bottomLeft
          `]: {
          paddingTop: token.paddingXS
        },
        [`> ${componentCls}`]: Object.assign(Object.assign(Object.assign({
          borderRadius: borderRadiusLG
        }, genMenuItemStyle(token)), genSubMenuArrowStyle(token)), {
          [`${componentCls}-item, ${componentCls}-submenu > ${componentCls}-submenu-title`]: {
            borderRadius: subMenuItemBorderRadius
          },
          [`${componentCls}-submenu-title::after`]: {
            transition: `transform ${motionDurationSlow} ${motionEaseInOut}`
          }
        })
      }
    }), genSubMenuArrowStyle(token)), {
      [`&-inline-collapsed ${componentCls}-submenu-arrow,
        &-inline ${componentCls}-submenu-arrow`]: {
        // ↓
        '&::before': {
          transform: `rotate(-45deg) translateX(${menuArrowOffset})`
        },
        '&::after': {
          transform: `rotate(45deg) translateX(-${menuArrowOffset})`
        }
      },
      [`${componentCls}-submenu-open${componentCls}-submenu-inline > ${componentCls}-submenu-title > ${componentCls}-submenu-arrow`]: {
        // ↑
        transform: `translateY(-${menuArrowSize * 0.2}px)`,
        '&::after': {
          transform: `rotate(-45deg) translateX(-${menuArrowOffset})`
        },
        '&::before': {
          transform: `rotate(45deg) translateX(${menuArrowOffset})`
        }
      }
    })
  },
  // Integration with header element so menu items have the same height
  {
    [`${antCls}-layout-header`]: {
      [componentCls]: {
        lineHeight: 'inherit'
      }
    }
  }];
};
// ============================== Export ==============================
export default ((prefixCls, injectStyle) => {
  const useOriginHook = genComponentStyleHook('Menu', token => {
    // Dropdown will handle menu style self. We do not need to handle this.
    if (injectStyle === false) {
      return [];
    }
    const {
      colorBgElevated,
      colorPrimary,
      colorTextLightSolid,
      controlHeightLG,
      fontSize,
      darkItemColor,
      darkDangerItemColor,
      darkItemBg,
      darkSubMenuItemBg,
      darkItemSelectedColor,
      darkItemSelectedBg,
      darkDangerItemSelectedBg,
      darkItemHoverBg,
      darkGroupTitleColor,
      darkItemHoverColor,
      darkItemDisabledColor,
      darkDangerItemHoverColor,
      darkDangerItemSelectedColor,
      darkDangerItemActiveBg
    } = token;
    const menuArrowSize = fontSize / 7 * 5;
    // Menu Token
    const menuToken = mergeToken(token, {
      menuArrowSize,
      menuHorizontalHeight: controlHeightLG * 1.15,
      menuArrowOffset: `${menuArrowSize * 0.25}px`,
      menuPanelMaskInset: -7,
      menuSubMenuBg: colorBgElevated
    });
    const menuDarkToken = mergeToken(menuToken, {
      itemColor: darkItemColor,
      itemHoverColor: darkItemHoverColor,
      groupTitleColor: darkGroupTitleColor,
      itemSelectedColor: darkItemSelectedColor,
      itemBg: darkItemBg,
      popupBg: darkItemBg,
      subMenuItemBg: darkSubMenuItemBg,
      itemActiveBg: 'transparent',
      itemSelectedBg: darkItemSelectedBg,
      activeBarHeight: 0,
      activeBarBorderWidth: 0,
      itemHoverBg: darkItemHoverBg,
      // Disabled
      itemDisabledColor: darkItemDisabledColor,
      // Danger
      dangerItemColor: darkDangerItemColor,
      dangerItemHoverColor: darkDangerItemHoverColor,
      dangerItemSelectedColor: darkDangerItemSelectedColor,
      dangerItemActiveBg: darkDangerItemActiveBg,
      dangerItemSelectedBg: darkDangerItemSelectedBg,
      menuSubMenuBg: darkSubMenuItemBg,
      // Horizontal
      horizontalItemSelectedColor: colorTextLightSolid,
      horizontalItemSelectedBg: colorPrimary
    });
    return [
    // Basic
    getBaseStyle(menuToken),
    // Horizontal
    getHorizontalStyle(menuToken),
    // Vertical
    getVerticalStyle(menuToken),
    // Theme
    getThemeStyle(menuToken, 'light'), getThemeStyle(menuDarkToken, 'dark'),
    // RTL
    getRTLStyle(menuToken),
    // Motion
    genCollapseMotion(menuToken), initSlideMotion(menuToken, 'slide-up'), initSlideMotion(menuToken, 'slide-down'), initZoomMotion(menuToken, 'zoom-big')];
  }, token => {
    const {
      colorPrimary,
      colorError,
      colorTextDisabled,
      colorErrorBg,
      colorText,
      colorTextDescription,
      colorBgContainer,
      colorFillAlter,
      colorFillContent,
      lineWidth,
      lineWidthBold,
      controlItemBgActive,
      colorBgTextHover,
      controlHeightLG,
      lineHeight,
      colorBgElevated,
      marginXXS,
      padding,
      fontSize,
      controlHeightSM,
      fontSizeLG,
      colorTextLightSolid,
      colorErrorHover
    } = token;
    const colorTextDark = new TinyColor(colorTextLightSolid).setAlpha(0.65).toRgbString();
    return {
      dropdownWidth: 160,
      zIndexPopup: token.zIndexPopupBase + 50,
      radiusItem: token.borderRadiusLG,
      itemBorderRadius: token.borderRadiusLG,
      radiusSubMenuItem: token.borderRadiusSM,
      subMenuItemBorderRadius: token.borderRadiusSM,
      colorItemText: colorText,
      itemColor: colorText,
      colorItemTextHover: colorText,
      itemHoverColor: colorText,
      colorItemTextHoverHorizontal: colorPrimary,
      horizontalItemHoverColor: colorPrimary,
      colorGroupTitle: colorTextDescription,
      groupTitleColor: colorTextDescription,
      colorItemTextSelected: colorPrimary,
      itemSelectedColor: colorPrimary,
      colorItemTextSelectedHorizontal: colorPrimary,
      horizontalItemSelectedColor: colorPrimary,
      colorItemBg: colorBgContainer,
      itemBg: colorBgContainer,
      colorItemBgHover: colorBgTextHover,
      itemHoverBg: colorBgTextHover,
      colorItemBgActive: colorFillContent,
      itemActiveBg: controlItemBgActive,
      colorSubItemBg: colorFillAlter,
      subMenuItemBg: colorFillAlter,
      colorItemBgSelected: controlItemBgActive,
      itemSelectedBg: controlItemBgActive,
      colorItemBgSelectedHorizontal: 'transparent',
      horizontalItemSelectedBg: 'transparent',
      colorActiveBarWidth: 0,
      activeBarWidth: 0,
      colorActiveBarHeight: lineWidthBold,
      activeBarHeight: lineWidthBold,
      colorActiveBarBorderSize: lineWidth,
      activeBarBorderWidth: lineWidth,
      // Disabled
      colorItemTextDisabled: colorTextDisabled,
      itemDisabledColor: colorTextDisabled,
      // Danger
      colorDangerItemText: colorError,
      dangerItemColor: colorError,
      colorDangerItemTextHover: colorError,
      dangerItemHoverColor: colorError,
      colorDangerItemTextSelected: colorError,
      dangerItemSelectedColor: colorError,
      colorDangerItemBgActive: colorErrorBg,
      dangerItemActiveBg: colorErrorBg,
      colorDangerItemBgSelected: colorErrorBg,
      dangerItemSelectedBg: colorErrorBg,
      itemMarginInline: token.marginXXS,
      horizontalItemBorderRadius: 0,
      horizontalItemHoverBg: 'transparent',
      itemHeight: controlHeightLG,
      groupTitleLineHeight: lineHeight,
      collapsedWidth: controlHeightLG * 2,
      popupBg: colorBgElevated,
      itemMarginBlock: marginXXS,
      itemPaddingInline: padding,
      horizontalLineHeight: `${controlHeightLG * 1.15}px`,
      iconSize: fontSize,
      iconMarginInlineEnd: controlHeightSM - fontSize,
      collapsedIconSize: fontSizeLG,
      groupTitleFontSize: fontSize,
      // Disabled
      darkItemDisabledColor: new TinyColor(colorTextLightSolid).setAlpha(0.25).toRgbString(),
      // Dark
      darkItemColor: colorTextDark,
      darkDangerItemColor: colorError,
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
      darkItemSelectedColor: colorTextLightSolid,
      darkItemSelectedBg: colorPrimary,
      darkDangerItemSelectedBg: colorError,
      darkItemHoverBg: 'transparent',
      darkGroupTitleColor: colorTextDark,
      darkItemHoverColor: colorTextLightSolid,
      darkDangerItemHoverColor: colorErrorHover,
      darkDangerItemSelectedColor: colorTextLightSolid,
      darkDangerItemActiveBg: colorError
    };
  }, {
    deprecatedTokens: [['colorGroupTitle', 'groupTitleColor'], ['radiusItem', 'itemBorderRadius'], ['radiusSubMenuItem', 'subMenuItemBorderRadius'], ['colorItemText', 'itemColor'], ['colorItemTextHover', 'itemHoverColor'], ['colorItemTextHoverHorizontal', 'horizontalItemHoverColor'], ['colorItemTextSelected', 'itemSelectedColor'], ['colorItemTextSelectedHorizontal', 'horizontalItemSelectedColor'], ['colorItemTextDisabled', 'itemDisabledColor'], ['colorDangerItemText', 'dangerItemColor'], ['colorDangerItemTextHover', 'dangerItemHoverColor'], ['colorDangerItemTextSelected', 'dangerItemSelectedColor'], ['colorDangerItemBgActive', 'dangerItemActiveBg'], ['colorDangerItemBgSelected', 'dangerItemSelectedBg'], ['colorItemBg', 'itemBg'], ['colorItemBgHover', 'itemHoverBg'], ['colorSubItemBg', 'subMenuItemBg'], ['colorItemBgActive', 'itemActiveBg'], ['colorItemBgSelectedHorizontal', 'horizontalItemSelectedBg'], ['colorActiveBarWidth', 'activeBarWidth'], ['colorActiveBarHeight', 'activeBarHeight'], ['colorActiveBarBorderSize', 'activeBarBorderWidth'], ['colorItemBgSelected', 'itemSelectedBg']]
  });
  return useOriginHook(prefixCls);
});