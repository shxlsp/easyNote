import { useRef, MutableRefObject } from 'react';

export const useDataCache = <T>(data: T | ((v?: T) => T)): MutableRefObject<T> => {
    const dataCacheRef = useRef<T>();
    let dataCache: T;
    if (data instanceof Function) {
        dataCache = data(dataCacheRef.current);
    } else {
        dataCache = data;
    }
    dataCacheRef.current = dataCache;
    return dataCacheRef as MutableRefObject<T>;
};
