import * as React from 'react';
import type { AnyObject } from './type';
export declare const isValidElement: typeof React.isValidElement;
export declare function isFragment(child: any): boolean;
type RenderProps = AnyObject | ((originProps: AnyObject) => AnyObject | void);
export declare function replaceElement(element: React.ReactNode, replacement: React.ReactNode, props?: RenderProps): React.ReactNode;
export declare function cloneElement(element: React.ReactNode, props?: RenderProps): React.ReactElement;
export {};
