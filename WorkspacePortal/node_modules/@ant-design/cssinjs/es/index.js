import useCacheToken, { getComputedToken } from "./hooks/useCacheToken";
import useStyleRegister, { extractStyle } from "./hooks/useStyleRegister";
import Keyframes from "./Keyframes";
import { legacyNotSelectorLinter, logicalPropertiesLinter, parentSelectorLinter } from "./linters";
import { createCache, StyleProvider } from "./StyleContext";
import { createTheme, Theme } from "./theme";
import legacyLogicalPropertiesTransformer from "./transformers/legacyLogicalProperties";
import px2remTransformer from "./transformers/px2rem";
import { supportLogicProps, supportWhere } from "./util";
export { Theme, createTheme, useStyleRegister, useCacheToken, createCache, StyleProvider, Keyframes, extractStyle, getComputedToken,
// Transformer
legacyLogicalPropertiesTransformer, px2remTransformer,
// Linters
logicalPropertiesLinter, legacyNotSelectorLinter, parentSelectorLinter };
export var _experimental = {
  supportModernCSS: function supportModernCSS() {
    return supportWhere() && supportLogicProps();
  }
};