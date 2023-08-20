import type { ReactNode } from 'react';
import React from 'react';
export type UseClosableParams = {
    closable?: boolean;
    closeIcon?: boolean | ReactNode;
    defaultClosable?: boolean;
    defaultCloseIcon?: ReactNode;
    customCloseIconRender?: (closeIcon: ReactNode) => ReactNode;
};
export default function useClosable(closable?: boolean, closeIcon?: boolean | ReactNode, customCloseIconRender?: (closeIcon: ReactNode) => ReactNode, defaultCloseIcon?: ReactNode, defaultClosable?: boolean): [closable: boolean, closeIcon: React.ReactNode | null];
