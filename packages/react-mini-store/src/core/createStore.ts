import { produce, Draft } from "immer";
import { useSyncExternalStore, useRef } from "react";

export type StoreState = Record<string, any>;
export type SetState<T> = (updater: (state: Draft<T>) => void) => void;

export type StoreApi<T extends StoreState, A> = {
    getState: () => T;
    setState: SetState<T>;
    resetState: () => void;
    subscribe: (listener: () => void) => () => void;
    actions: A;
    computed: Record<string, any>;
};

export type CreateStoreConfig<T extends StoreState, A> = {
    state: T;
    actions?: (set: SetState<T>, get: () => T) => A;
    computed?: Record<string, (state: T) => any>;
    middleware?: ((store: StoreApi<T, A>) => StoreApi<T, A>)[];
};

// WeakMap per memoizzare computed per stato
const computedCache = new WeakMap<object, Record<string, any>>();

export function createStore<T extends StoreState, A = {}>(
    config: CreateStoreConfig<T, A>
): StoreApi<T, A> {
    let state = config.state;
    const listeners = new Set<() => void>();

    const getState = () => state;

    const computeValues = (s: T) => {
        if (!config.computed) return {};
        if (computedCache.has(s)) return computedCache.get(s)!;

        const result: Record<string, any> = {};
        for (const key in config.computed) {
            result[key] = config.computed[key](s);
        }
        computedCache.set(s, result);
        return result;
    };

    const setState: SetState<T> = (updater) => {
        const next = produce(state, updater as any);
        if (next !== state) {
            state = next;
            store.computed = computeValues(state);
            listeners.forEach((l) => l());
        }
    };

    const resetState = () => {
        state = config.state;
        store.computed = computeValues(state);
        listeners.forEach((l) => l());
    };

    const subscribe = (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    const actions = config.actions ? config.actions(setState, getState) : ({} as A);
    const computed = computeValues(state);

    let store: StoreApi<T, A> = { getState, setState, resetState, subscribe, actions, computed };

    if (config.middleware) {
        for (const mw of config.middleware) {
            store = mw(store);
        }
    }

    return store;
}

type EqualityFn<T> = (a: T, b: T) => boolean;
const shallowEqual = <T>(a: T, b: T) => {
    if (Object.is(a, b)) return true;
    if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) return false;
    const ka = Object.keys(a as any), kb = Object.keys(b as any);
    if (ka.length !== kb.length) return false;
    for (let k of ka) {
        if (!(k in (b as any)) || !Object.is((a as any)[k], (b as any)[k])) return false;
    }
    return true;
};

const selectorCache = new WeakMap<object, Map<Function, any>>();

export function useStore<T extends StoreState, A, U = T>(
    store: StoreApi<T, A>,
    selector: (s: T & { computed: Record<string, any> }) => U = s => (s as unknown as U),
    equalityFn: EqualityFn<U> = shallowEqual
): U {
    const subscribe = store.subscribe;
    const getSnapshot = () => {
        // memoizzazione per selector e store
        if (!selectorCache.has(store)) selectorCache.set(store, new Map());
        const storeCache = selectorCache.get(store)!;
        if (storeCache.has(selector)) return storeCache.get(selector);
        const value = selector({ ...store.getState(), computed: store.computed });
        storeCache.set(selector, value);
        return value;
    };

    const selected = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    const lastRef = useRef<{ value: U } | null>(null);
    if (!lastRef.current || !equalityFn(lastRef.current.value, selected)) {
        lastRef.current = { value: selected };
    }
    return lastRef.current.value;
}
