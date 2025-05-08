import React, { useRef, useEffect, useCallback } from "react";

interface Options {
  leading?: boolean;
  trailing?: boolean;
}
type ThrottleFnPeer<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;
type ThrottleFn<T extends (...args: any) => any> = ThrottleFnPeer<T> & {
  cancel: () => void;
};
// eslint-disable-next-line max-params
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  dep: any[] = [],
  options: Options = { leading: true, trailing: false }
): ThrottleFn<T> {
  const { current } = useRef<{
    fn: T;
    timer: number | null;
    visitedParams?: Parameters<T>;
    promise?: Promise<ReturnType<T>>;
    options: Options;
    clearFn: () => void;
  }>({
    fn,
    timer: null,
    options,
    clearFn: () => {
      current.timer && clearTimeout(current.timer);
    },
  });

  useEffect(() => {
    current.fn = fn;
  }, [fn, current]);

  const throttleFn = useCallback<ThrottleFnPeer<T>>(
    (...args) => {
      if (current.promise) {
        current.visitedParams = args;
        return current.promise;
      }

      current.promise = new Promise((resolve) => {
        let res;
        if (current.options.leading) {
          res = current.fn.call(this, ...args);
        }
        current.timer = window.setTimeout(() => {
          current.timer = null;
          current.promise = null;
          // 执行promise后，仍存在访问。并且trailing为true
          if (current.visitedParams && current.options.trailing) {
            const params = current.visitedParams;
            current.visitedParams = undefined;
            resolve(current.fn.call(this, ...params));
            return;
          }
          resolve(res);
        }, delay);
      });

      return current.promise;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, delay, ...dep]
  ) as ThrottleFn<T>;

  throttleFn.cancel = current.clearFn;

  return throttleFn;
}
