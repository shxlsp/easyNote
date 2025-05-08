import { useState, useRef, useMemo, useCallback } from 'react';
type pick<T> = {
    [P in keyof T]?: T[P];
};

export type State<T> = pick<T> | ((state: T) => pick<T>);

export type Dispatch<T> = (state: State<T>, cb?: (current: T) => void) => void;
export type UseStateClass<T> = (initialState: T) => [T, Dispatch<T>];
export default <T>(initialState: T) => {
    const [state, setState] = useState<T>(initialState);
    const stateRef = useRef<T>(initialState);
    const dispatch: Dispatch<T> = useCallback((newState: State<T>, cb?: (current: T) => void) => {
        const prevState = stateRef.current;
        const relNewState = newState instanceof Function ? newState(prevState) : newState;
        let isAllSame = true;
        for (let key in relNewState) {
            if (prevState[key] !== relNewState) {
                isAllSame = false;
                break;
            }
        }
        if (isAllSame) {
            return;
        }
        const finState = {
            ...prevState,
            ...relNewState,
        };
        setState(finState);
        stateRef.current = finState;
        cb && setTimeout(() => cb(stateRef.current), 0);
    }, []);

    return useMemo<[T, Dispatch<T>, { current: T }]>(() => [state, dispatch, stateRef], [dispatch, state]);
};
