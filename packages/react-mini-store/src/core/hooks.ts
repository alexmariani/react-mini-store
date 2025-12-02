import { useCallback, useDebugValue, useRef, useSyncExternalStore } from "react";
import { StoreApi, StoreSnapshot, StoreState } from "./createStore";
import { StoreToken, useStoreRegistry } from "./storeContext";

// Utility shallowEqual (integrata per evitare dipendenze esterne)
const shallowEqual = (objA: any, objB: any) => {
    if (Object.is(objA, objB)) return true;
    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) return false;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (let i = 0; i < keysA.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) return false;
    }
    return true;
};

export function useStore<TState extends StoreState, TActions, U>(
    token: StoreToken<TState, TActions>,
    selector: (state: StoreSnapshot<TState>) => U,
    equalityFn: (a: U, b: U) => boolean = shallowEqual // Default a shallowEqual!
): U {
    // Questo context ora è super stabile
    const registry = useStoreRegistry();
    const store = registry.get(token) as StoreApi<TState, TActions> | undefined;

    if (!store) {
        throw new Error(`Store not found for token ${String(token)}`);
    }

    // Memoizzazione manuale del selettore per React 18
    // (Equivalente a useSyncExternalStoreWithSelector)
    const getSnapshot = store.getState;

    const lastSnapshot = useRef(getSnapshot());
    const lastSelection = useRef(selector(lastSnapshot.current));

    const getSelection = useCallback(() => {
        const nextSnapshot = getSnapshot();

        // Se lo stato raw non è cambiato, ritorna subito la vecchia selezione
        if (Object.is(nextSnapshot, lastSnapshot.current)) {
            return lastSelection.current;
        }

        const nextSelection = selector(nextSnapshot);

        // Se lo stato è cambiato, ma il risultato del selettore è "uguale" (shallow)
        if (equalityFn(lastSelection.current, nextSelection)) {
            // Aggiorniamo solo lo snapshot di riferimento, non la selezione
            // Questo impedisce a React di re-renderizzare
            lastSnapshot.current = nextSnapshot;
            return lastSelection.current;
        }

        lastSnapshot.current = nextSnapshot;
        lastSelection.current = nextSelection;
        return nextSelection;
    }, [getSnapshot, selector, equalityFn]);

    const value = useSyncExternalStore(store.subscribe, getSelection, getSelection);

    useDebugValue(value);
    return value;
}

export function useStoreActions<TState extends StoreState, TActions>(
    token: StoreToken<TState, TActions>
): TActions {
    const registry = useStoreRegistry();
    const store = registry.get(token) as StoreApi<TState, TActions> | undefined;
    if (!store) throw new Error(`Store not found`);
    return store.actions;
}
