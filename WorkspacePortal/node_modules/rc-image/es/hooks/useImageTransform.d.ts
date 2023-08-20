/// <reference types="react" />
export type TransformType = {
    x: number;
    y: number;
    rotate: number;
    scale: number;
    flipX: boolean;
    flipY: boolean;
};
export type TransformAction = 'flipY' | 'flipX' | 'rotateLeft' | 'rotateRight' | 'zoomIn' | 'zoomOut' | 'close' | 'prev' | 'next' | 'wheel' | 'doubleClick' | 'move' | 'dragRebound';
export default function useImageTransform(imgRef: React.MutableRefObject<HTMLImageElement>, minScale: number, maxScale: number, onTransform: (info: {
    transform: TransformType;
    action: TransformAction;
}) => void): {
    transform: {
        x: number;
        y: number;
        rotate: number;
        scale: number;
        flipX: boolean;
        flipY: boolean;
    };
    resetTransform: (action: TransformAction) => void;
    updateTransform: (newTransform: Partial<TransformType>, action: TransformAction) => void;
    dispatchZoomChange: (ratio: number, action: TransformAction, clientX?: number, clientY?: number) => void;
};
