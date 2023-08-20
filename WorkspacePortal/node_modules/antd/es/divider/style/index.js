import { resetComponent } from '../../style';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
// ============================== Shared ==============================
const genSharedDividerStyle = token => {
  const {
    componentCls,
    sizePaddingEdgeHorizontal,
    colorSplit,
    lineWidth
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
      borderBlockStart: `${lineWidth}px solid ${colorSplit}`,
      // vertical
      '&-vertical': {
        position: 'relative',
        top: '-0.06em',
        display: 'inline-block',
        height: '0.9em',
        margin: `0 ${token.dividerVerticalGutterMargin}px`,
        verticalAlign: 'middle',
        borderTop: 0,
        borderInlineStart: `${lineWidth}px solid ${colorSplit}`
      },
      '&-horizontal': {
        display: 'flex',
        clear: 'both',
        width: '100%',
        minWidth: '100%',
        margin: `${token.dividerHorizontalGutterMargin}px 0`
      },
      [`&-horizontal${componentCls}-with-text`]: {
        display: 'flex',
        alignItems: 'center',
        margin: `${token.dividerHorizontalWithTextGutterMargin}px 0`,
        color: token.colorTextHeading,
        fontWeight: 500,
        fontSize: token.fontSizeLG,
        whiteSpace: 'nowrap',
        textAlign: 'center',
        borderBlockStart: `0 ${colorSplit}`,
        '&::before, &::after': {
          position: 'relative',
          width: '50%',
          borderBlockStart: `${lineWidth}px solid transparent`,
          // Chrome not accept `inherit` in `border-top`
          borderBlockStartColor: 'inherit',
          borderBlockEnd: 0,
          transform: 'translateY(50%)',
          content: "''"
        }
      },
      [`&-horizontal${componentCls}-with-text-left`]: {
        '&::before': {
          width: '5%'
        },
        '&::after': {
          width: '95%'
        }
      },
      [`&-horizontal${componentCls}-with-text-right`]: {
        '&::before': {
          width: '95%'
        },
        '&::after': {
          width: '5%'
        }
      },
      [`${componentCls}-inner-text`]: {
        display: 'inline-block',
        padding: '0 1em'
      },
      '&-dashed': {
        background: 'none',
        borderColor: colorSplit,
        borderStyle: 'dashed',
        borderWidth: `${lineWidth}px 0 0`
      },
      [`&-horizontal${componentCls}-with-text${componentCls}-dashed`]: {
        '&::before, &::after': {
          borderStyle: 'dashed none none'
        }
      },
      [`&-vertical${componentCls}-dashed`]: {
        borderInlineStartWidth: lineWidth,
        borderInlineEnd: 0,
        borderBlockStart: 0,
        borderBlockEnd: 0
      },
      [`&-plain${componentCls}-with-text`]: {
        color: token.colorText,
        fontWeight: 'normal',
        fontSize: token.fontSize
      },
      [`&-horizontal${componentCls}-with-text-left${componentCls}-no-default-orientation-margin-left`]: {
        '&::before': {
          width: 0
        },
        '&::after': {
          width: '100%'
        },
        [`${componentCls}-inner-text`]: {
          paddingInlineStart: sizePaddingEdgeHorizontal
        }
      },
      [`&-horizontal${componentCls}-with-text-right${componentCls}-no-default-orientation-margin-right`]: {
        '&::before': {
          width: '100%'
        },
        '&::after': {
          width: 0
        },
        [`${componentCls}-inner-text`]: {
          paddingInlineEnd: sizePaddingEdgeHorizontal
        }
      }
    })
  };
};
// ============================== Export ==============================
export default genComponentStyleHook('Divider', token => {
  const dividerToken = mergeToken(token, {
    dividerVerticalGutterMargin: token.marginXS,
    dividerHorizontalWithTextGutterMargin: token.margin,
    dividerHorizontalGutterMargin: token.marginLG
  });
  return [genSharedDividerStyle(dividerToken)];
}, {
  sizePaddingEdgeHorizontal: 0
});