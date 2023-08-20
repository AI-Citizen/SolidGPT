import { clearFix, resetComponent, textEllipsis } from '../../style';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
// ============================== Styles ==============================
// ============================== Head ==============================
const genCardHeadStyle = token => {
  const {
    antCls,
    componentCls,
    headerHeight,
    cardPaddingBase,
    tabsMarginBottom
  } = token;
  return Object.assign(Object.assign({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: headerHeight,
    marginBottom: -1,
    padding: `0 ${cardPaddingBase}px`,
    color: token.colorTextHeading,
    fontWeight: token.fontWeightStrong,
    fontSize: token.headerFontSize,
    background: token.headerBg,
    borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
    borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`
  }, clearFix()), {
    '&-wrapper': {
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    },
    '&-title': Object.assign(Object.assign({
      display: 'inline-block',
      flex: 1
    }, textEllipsis), {
      [`
          > ${componentCls}-typography,
          > ${componentCls}-typography-edit-content
        `]: {
        insetInlineStart: 0,
        marginTop: 0,
        marginBottom: 0
      }
    }),
    [`${antCls}-tabs-top`]: {
      clear: 'both',
      marginBottom: tabsMarginBottom,
      color: token.colorText,
      fontWeight: 'normal',
      fontSize: token.fontSize,
      '&-bar': {
        borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`
      }
    }
  });
};
// ============================== Grid ==============================
const genCardGridStyle = token => {
  const {
    cardPaddingBase,
    colorBorderSecondary,
    cardShadow,
    lineWidth
  } = token;
  return {
    width: '33.33%',
    padding: cardPaddingBase,
    border: 0,
    borderRadius: 0,
    boxShadow: `
      ${lineWidth}px 0 0 0 ${colorBorderSecondary},
      0 ${lineWidth}px 0 0 ${colorBorderSecondary},
      ${lineWidth}px ${lineWidth}px 0 0 ${colorBorderSecondary},
      ${lineWidth}px 0 0 0 ${colorBorderSecondary} inset,
      0 ${lineWidth}px 0 0 ${colorBorderSecondary} inset;
    `,
    transition: `all ${token.motionDurationMid}`,
    '&-hoverable:hover': {
      position: 'relative',
      zIndex: 1,
      boxShadow: cardShadow
    }
  };
};
// ============================== Actions ==============================
const genCardActionsStyle = token => {
  const {
    componentCls,
    iconCls,
    actionsLiMargin,
    cardActionsIconSize,
    colorBorderSecondary,
    actionsBg
  } = token;
  return Object.assign(Object.assign({
    margin: 0,
    padding: 0,
    listStyle: 'none',
    background: actionsBg,
    borderTop: `${token.lineWidth}px ${token.lineType} ${colorBorderSecondary}`,
    display: 'flex',
    borderRadius: `0 0 ${token.borderRadiusLG}px ${token.borderRadiusLG}px `
  }, clearFix()), {
    '& > li': {
      margin: actionsLiMargin,
      color: token.colorTextDescription,
      textAlign: 'center',
      '> span': {
        position: 'relative',
        display: 'block',
        minWidth: token.cardActionsIconSize * 2,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        cursor: 'pointer',
        '&:hover': {
          color: token.colorPrimary,
          transition: `color ${token.motionDurationMid}`
        },
        [`a:not(${componentCls}-btn), > ${iconCls}`]: {
          display: 'inline-block',
          width: '100%',
          color: token.colorTextDescription,
          lineHeight: `${token.fontSize * token.lineHeight}px`,
          transition: `color ${token.motionDurationMid}`,
          '&:hover': {
            color: token.colorPrimary
          }
        },
        [`> ${iconCls}`]: {
          fontSize: cardActionsIconSize,
          lineHeight: `${cardActionsIconSize * token.lineHeight}px`
        }
      },
      '&:not(:last-child)': {
        borderInlineEnd: `${token.lineWidth}px ${token.lineType} ${colorBorderSecondary}`
      }
    }
  });
};
// ============================== Meta ==============================
const genCardMetaStyle = token => Object.assign(Object.assign({
  margin: `-${token.marginXXS}px 0`,
  display: 'flex'
}, clearFix()), {
  '&-avatar': {
    paddingInlineEnd: token.padding
  },
  '&-detail': {
    overflow: 'hidden',
    flex: 1,
    '> div:not(:last-child)': {
      marginBottom: token.marginXS
    }
  },
  '&-title': Object.assign({
    color: token.colorTextHeading,
    fontWeight: token.fontWeightStrong,
    fontSize: token.fontSizeLG
  }, textEllipsis),
  '&-description': {
    color: token.colorTextDescription
  }
});
// ============================== Inner ==============================
const genCardTypeInnerStyle = token => {
  const {
    componentCls,
    cardPaddingBase,
    colorFillAlter
  } = token;
  return {
    [`${componentCls}-head`]: {
      padding: `0 ${cardPaddingBase}px`,
      background: colorFillAlter,
      '&-title': {
        fontSize: token.fontSize
      }
    },
    [`${componentCls}-body`]: {
      padding: `${token.padding}px ${cardPaddingBase}px`
    }
  };
};
// ============================== Loading ==============================
const genCardLoadingStyle = token => {
  const {
    componentCls
  } = token;
  return {
    overflow: 'hidden',
    [`${componentCls}-body`]: {
      userSelect: 'none'
    }
  };
};
// ============================== Basic ==============================
const genCardStyle = token => {
  const {
    antCls,
    componentCls,
    cardShadow,
    cardHeadPadding,
    colorBorderSecondary,
    boxShadowTertiary,
    cardPaddingBase,
    extraColor
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
      position: 'relative',
      background: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      [`&:not(${componentCls}-bordered)`]: {
        boxShadow: boxShadowTertiary
      },
      [`${componentCls}-head`]: genCardHeadStyle(token),
      [`${componentCls}-extra`]: {
        // https://stackoverflow.com/a/22429853/3040605
        marginInlineStart: 'auto',
        color: extraColor,
        fontWeight: 'normal',
        fontSize: token.fontSize
      },
      [`${componentCls}-body`]: Object.assign({
        padding: cardPaddingBase,
        borderRadius: ` 0 0 ${token.borderRadiusLG}px ${token.borderRadiusLG}px`
      }, clearFix()),
      [`${componentCls}-grid`]: genCardGridStyle(token),
      [`${componentCls}-cover`]: {
        '> *': {
          display: 'block',
          width: '100%'
        },
        [`img, img + ${antCls}-image-mask`]: {
          borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`
        }
      },
      [`${componentCls}-actions`]: genCardActionsStyle(token),
      [`${componentCls}-meta`]: genCardMetaStyle(token)
    }),
    [`${componentCls}-bordered`]: {
      border: `${token.lineWidth}px ${token.lineType} ${colorBorderSecondary}`,
      [`${componentCls}-cover`]: {
        marginTop: -1,
        marginInlineStart: -1,
        marginInlineEnd: -1
      }
    },
    [`${componentCls}-hoverable`]: {
      cursor: 'pointer',
      transition: `box-shadow ${token.motionDurationMid}, border-color ${token.motionDurationMid}`,
      '&:hover': {
        borderColor: 'transparent',
        boxShadow: cardShadow
      }
    },
    [`${componentCls}-contain-grid`]: {
      [`${componentCls}-body`]: {
        display: 'flex',
        flexWrap: 'wrap'
      },
      [`&:not(${componentCls}-loading) ${componentCls}-body`]: {
        marginBlockStart: -token.lineWidth,
        marginInlineStart: -token.lineWidth,
        padding: 0
      }
    },
    [`${componentCls}-contain-tabs`]: {
      [`> ${componentCls}-head`]: {
        [`${componentCls}-head-title, ${componentCls}-extra`]: {
          paddingTop: cardHeadPadding
        }
      }
    },
    [`${componentCls}-type-inner`]: genCardTypeInnerStyle(token),
    [`${componentCls}-loading`]: genCardLoadingStyle(token),
    [`${componentCls}-rtl`]: {
      direction: 'rtl'
    }
  };
};
// ============================== Size ==============================
const genCardSizeStyle = token => {
  const {
    componentCls,
    cardPaddingSM,
    headerHeightSM,
    headerFontSizeSM
  } = token;
  return {
    [`${componentCls}-small`]: {
      [`> ${componentCls}-head`]: {
        minHeight: headerHeightSM,
        padding: `0 ${cardPaddingSM}px`,
        fontSize: headerFontSizeSM,
        [`> ${componentCls}-head-wrapper`]: {
          [`> ${componentCls}-extra`]: {
            fontSize: token.fontSize
          }
        }
      },
      [`> ${componentCls}-body`]: {
        padding: cardPaddingSM
      }
    },
    [`${componentCls}-small${componentCls}-contain-tabs`]: {
      [`> ${componentCls}-head`]: {
        [`${componentCls}-head-title, ${componentCls}-extra`]: {
          minHeight: headerHeightSM,
          paddingTop: 0,
          display: 'flex',
          alignItems: 'center'
        }
      }
    }
  };
};
// ============================== Export ==============================
export default genComponentStyleHook('Card', token => {
  const cardToken = mergeToken(token, {
    cardShadow: token.boxShadowCard,
    cardHeadPadding: token.padding,
    cardPaddingBase: token.paddingLG,
    cardActionsIconSize: token.fontSize,
    cardPaddingSM: 12 // Fixed padding.
  });

  return [
  // Style
  genCardStyle(cardToken),
  // Size
  genCardSizeStyle(cardToken)];
}, token => ({
  headerBg: 'transparent',
  headerFontSize: token.fontSizeLG,
  headerFontSizeSM: token.fontSize,
  headerHeight: token.fontSizeLG * token.lineHeightLG + token.padding * 2,
  headerHeightSM: token.fontSize * token.lineHeight + token.paddingXS * 2,
  actionsBg: token.colorBgContainer,
  actionsLiMargin: `${token.paddingSM}px 0`,
  tabsMarginBottom: -token.padding - token.lineWidth,
  extraColor: token.colorText
}));