import { genComponentStyleHook } from '../../theme/internal';
// =============================== Base ===============================
const genBaseStyle = token => {
  const {
    componentCls,
    colorText,
    fontSize,
    lineHeight,
    fontFamily
  } = token;
  return {
    [componentCls]: {
      color: colorText,
      fontSize,
      lineHeight,
      fontFamily
    }
  };
};
// ============================== Export ==============================
export default genComponentStyleHook('App', token => [genBaseStyle(token)]);