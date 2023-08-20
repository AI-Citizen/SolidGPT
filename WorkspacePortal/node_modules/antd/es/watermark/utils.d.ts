/// <reference types="react" />
/** converting camel-cased strings to be lowercase and link it with Separato */
export declare function toLowercaseSeparator(key: string): string;
export declare function getStyleStr(style: React.CSSProperties): string;
/** Returns the ratio of the device's physical pixel resolution to the css pixel resolution */
export declare function getPixelRatio(): number;
/** Rotate with the watermark as the center point */
export declare function rotateWatermark(ctx: CanvasRenderingContext2D, rotateX: number, rotateY: number, rotate: number): void;
/** Whether to re-render the watermark */
export declare const reRendering: (mutation: MutationRecord, watermarkElement?: HTMLElement) => boolean;
