type throttledFn = (...args: any[]) => void;
type throttledCancelFn = {
    cancel: () => void;
};
declare function throttleByAnimationFrame<T extends any[]>(fn: (...args: T) => void): throttledFn & throttledCancelFn;
export default throttleByAnimationFrame;
