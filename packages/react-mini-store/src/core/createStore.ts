import { produce, Draft } from "immer";

export type StoreState = Record<string, any>;

export type StoreSnapshot<T> = T & { computed: Record<string, any> };

// Aggiornato: accetta un secondo parametro opzionale 'actionName' per il debugging
export type SetState<T> = (updater: (state: Draft<T>) => void, actionName?: string) => void;

export type StoreApi<T extends StoreState, A> = {
    getState: () => StoreSnapshot<T>;
    setState: SetState<T>;
    subscribe: (listener: () => void) => () => void;
    actions: A;
};

// Definizione del tipo Middleware
export type Middleware<T extends StoreState, A> = (
    store: StoreApi<T, A>
) => StoreApi<T, A>;

export type CreateStoreConfig<T extends StoreState, A> = {
    state: T;
    actions?: (set: SetState<T>, get: () => StoreSnapshot<T>) => A;
    computed?: Record<string, (state: T) => any>;
    middleware?: Middleware<T, A>[]; // <--- Supporto Middleware
};

export function createStore<T extends StoreState, A = {}>(
    config: CreateStoreConfig<T, A>
): StoreApi<T, A> {
    let rawState = config.state;
    let computedCache: Record<string, any> = {};
    let combinedSnapshot: StoreSnapshot<T>;

    const listeners = new Set<() => void>();

    const syncSnapshot = () => {
        if (config.computed) {
            const newComputed: Record<string, any> = {};
            for (const key in config.computed) {
                newComputed[key] = config.computed[key](rawState);
            }
            computedCache = newComputed;
        }
        combinedSnapshot = { ...rawState, computed: computedCache } as StoreSnapshot<T>;
    };

    syncSnapshot();

    const getState = () => combinedSnapshot;

    // L'implementazione interna base
    const internalSetState: SetState<T> = (updater, actionName) => {
        const nextRawState = produce(rawState, updater as any);
        if (nextRawState !== rawState) {
            rawState = nextRawState;
            syncSnapshot();
            listeners.forEach((l) => l());
        }
    };

    const subscribe = (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    // TRUCCO PROXY:
    // Le actions chiamano 'store.setState' invece di 'internalSetState'.
    // Questo permette ai middleware di intercettare le chiamate fatte dalle actions.
    const setStateProxy: SetState<T> = (updater, actionName) => {
        store.setState(updater, actionName);
    };

    const actions = config.actions
        ? config.actions(setStateProxy, getState)
        : ({} as A);

    // Creiamo l'oggetto store base
    let store: StoreApi<T, A> = {
        getState,
        setState: internalSetState,
        subscribe,
        actions,
    };

    // Applichiamo i middleware (Store Enhancers)
    if (config.middleware) {
        for (const mw of config.middleware) {
            store = mw(store);
        }
    }

    return store;
}
