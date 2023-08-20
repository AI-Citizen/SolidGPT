import type { ReactNode } from 'react';
import React from 'react';
import type { AppConfig, useAppProps } from './context';
export interface AppProps extends AppConfig {
    style?: React.CSSProperties;
    className?: string;
    rootClassName?: string;
    prefixCls?: string;
    children?: ReactNode;
}
declare const useApp: () => useAppProps;
declare const App: React.FC<AppProps> & {
    useApp: typeof useApp;
};
export default App;
