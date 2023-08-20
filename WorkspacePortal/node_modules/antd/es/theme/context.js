import { createTheme } from '@ant-design/cssinjs';
import React from 'react';
import defaultDerivative from './themes/default';
import defaultSeedToken from './themes/seed';
export const defaultTheme = createTheme(defaultDerivative);
// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
export const defaultConfig = {
  token: defaultSeedToken,
  hashed: true
};
export const DesignTokenContext = /*#__PURE__*/React.createContext(defaultConfig);