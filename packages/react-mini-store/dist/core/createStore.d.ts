import { Draft } from 'immer';
export type StoreState = Record<string, any>;
export type StoreSnapshot<T> = T & {
    computed: Record<string, any>;
};
export type SetState<T> = (updater: (state: Draft<T>) => void, actionName?: string) => void;
export type StoreApi<T extends StoreState, A> = {
    getState: () => StoreSnapshot<T>;
    setState: SetState<T>;
    subscribe: (listener: () => void) => () => void;
    actions: A;
};
export type Middleware<T extends StoreState, A> = (store: StoreApi<T, A>) => StoreApi<T, A>;
export type CreateStoreConfig<T extends StoreState, A> = {
    state: T;
    actions?: (set: SetState<T>, get: () => StoreSnapshot<T>) => A;
    computed?: Record<string, (state: T) => any>;
    middleware?: Middleware<T, A>[];
};
export declare function createStore<T extends StoreState, A = {}>(config: CreateStoreConfig<T, A>): StoreApi<T, A>;
