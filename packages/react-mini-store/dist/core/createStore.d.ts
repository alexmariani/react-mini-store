import { Draft } from 'immer';
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
export declare function createStore<T extends StoreState, A = {}>(config: CreateStoreConfig<T, A>): StoreApi<T, A>;
type EqualityFn<T> = (a: T, b: T) => boolean;
export declare function useStore<T extends StoreState, A, U = T>(store: StoreApi<T, A>, selector?: (s: T & {
    computed: Record<string, any>;
}) => U, equalityFn?: EqualityFn<U>): U;
export {};
