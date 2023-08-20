import { getStyle as getCheckboxStyle } from '../../checkbox/style';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { genTreeStyle } from '../../tree/style';
// =============================== Base ===============================
const genBaseStyle = token => {
  const {
    componentCls,
    treePrefixCls,
    colorBgElevated
  } = token;
  const treeCls = `.${treePrefixCls}`;
  return [
  // ======================================================
  // ==                     Dropdown                     ==
  // ======================================================
  {
    [`${componentCls}-dropdown`]: [{
      padding: `${token.paddingXS}px ${token.paddingXS / 2}px`
    },
    // ====================== Tree ======================
    genTreeStyle(treePrefixCls, mergeToken(token, {
      colorBgContainer: colorBgElevated
    })), {
      [treeCls]: {
        borderRadius: 0,
        [`${treeCls}-list-holder-inner`]: {
          alignItems: 'stretch',
          [`${treeCls}-treenode`]: {
            [`${treeCls}-node-content-wrapper`]: {
              flex: 'auto'
            }
          }
        }
      }
    },
    // ==================== Checkbox ====================
    getCheckboxStyle(`${treePrefixCls}-checkbox`, token),
    // ====================== RTL =======================
    {
      '&-rtl': {
        direction: 'rtl',
        [`${treeCls}-switcher${treeCls}-switcher_close`]: {
          [`${treeCls}-switcher-icon svg`]: {
            transform: 'rotate(90deg)'
          }
        }
      }
    }]
  }];
};
// ============================== Export ==============================
export default function useTreeSelectStyle(prefixCls, treePrefixCls) {
  return genComponentStyleHook('TreeSelect', token => {
    const treeSelectToken = mergeToken(token, {
      treePrefixCls
    });
    return [genBaseStyle(treeSelectToken)];
  })(prefixCls);
}