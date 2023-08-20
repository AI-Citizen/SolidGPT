import { genComponentStyleHook, mergeToken } from '../../theme/internal';
// ============================== Shared ==============================
const genSharedAffixStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: {
      position: 'fixed',
      zIndex: token.zIndexPopup
    }
  };
};
// ============================== Export ==============================
export default genComponentStyleHook('Affix', token => {
  const affixToken = mergeToken(token, {
    zIndexPopup: token.zIndexBase + 10
  });
  return [genSharedAffixStyle(affixToken)];
});