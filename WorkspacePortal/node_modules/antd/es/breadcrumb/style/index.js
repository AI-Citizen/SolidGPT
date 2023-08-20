import { genFocusStyle, resetComponent } from '../../style';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
const genBreadcrumbStyle = token => {
  const {
    componentCls,
    iconCls
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
      color: token.itemColor,
      fontSize: token.fontSize,
      [iconCls]: {
        fontSize: token.iconFontSize
      },
      ol: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: 0,
        padding: 0,
        listStyle: 'none'
      },
      a: Object.assign({
        color: token.linkColor,
        transition: `color ${token.motionDurationMid}`,
        padding: `0 ${token.paddingXXS}px`,
        borderRadius: token.borderRadiusSM,
        height: token.lineHeight * token.fontSize,
        display: 'inline-block',
        marginInline: -token.marginXXS,
        '&:hover': {
          color: token.linkHoverColor,
          backgroundColor: token.colorBgTextHover
        }
      }, genFocusStyle(token)),
      [`li:last-child`]: {
        color: token.lastItemColor
      },
      [`${componentCls}-separator`]: {
        marginInline: token.separatorMargin,
        color: token.separatorColor
      },
      [`${componentCls}-link`]: {
        [`
          > ${iconCls} + span,
          > ${iconCls} + a
        `]: {
          marginInlineStart: token.marginXXS
        }
      },
      [`${componentCls}-overlay-link`]: {
        borderRadius: token.borderRadiusSM,
        height: token.lineHeight * token.fontSize,
        display: 'inline-block',
        padding: `0 ${token.paddingXXS}px`,
        marginInline: -token.marginXXS,
        [`> ${iconCls}`]: {
          marginInlineStart: token.marginXXS,
          fontSize: token.fontSizeIcon
        },
        '&:hover': {
          color: token.linkHoverColor,
          backgroundColor: token.colorBgTextHover,
          a: {
            color: token.linkHoverColor
          }
        },
        a: {
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }
      },
      // rtl style
      [`&${token.componentCls}-rtl`]: {
        direction: 'rtl'
      }
    })
  };
};
// ============================== Export ==============================
export default genComponentStyleHook('Breadcrumb', token => {
  const BreadcrumbToken = mergeToken(token, {});
  return [genBreadcrumbStyle(BreadcrumbToken)];
}, token => ({
  itemColor: token.colorTextDescription,
  lastItemColor: token.colorText,
  iconFontSize: token.fontSize,
  linkColor: token.colorTextDescription,
  linkHoverColor: token.colorText,
  separatorColor: token.colorTextDescription,
  separatorMargin: token.marginXS
}));