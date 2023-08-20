import type { FC } from 'react';
declare type HandlerSize = 'default' | 'small';
declare const Handler: FC<{
    size?: HandlerSize;
    color?: string;
    prefixCls?: string;
}>;
export default Handler;
