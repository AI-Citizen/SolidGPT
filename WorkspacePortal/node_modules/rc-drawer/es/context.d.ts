import * as React from 'react';
export interface DrawerContextProps {
    pushDistance?: number | string;
    push: VoidFunction;
    pull: VoidFunction;
}
declare const DrawerContext: React.Context<DrawerContextProps>;
export default DrawerContext;
