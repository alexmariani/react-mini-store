import { StoreApi, StoreState } from "./createStore";

/**
 * Stack dei fornitori: ogni entry mappa token → store
 * L’ultimo in cima allo stack è il più vicino nel tree padre-figlio
 */
const storeStack: Map<symbol, StoreApi<any, any>>[] = [];

/** Padre registra uno store per il token */
export function provideStore<T>(token: symbol, store: StoreApi<any, T>) {
    const map = new Map<symbol, StoreApi<any, any>>();
    map.set(token, store);
    storeStack.push(map);

    return () => {
        const idx = storeStack.indexOf(map);
        if (idx >= 0) storeStack.splice(idx, 1);
    };
}


/**
 * Hook per ottenere lo store associato a un token.
 * Risale lo stack dei provider padre-figlio.
 *
 * @param token simbolo che identifica lo store
 * @returns StoreApi con stato TState e azioni TActions
 * @throws errore se nessuno store corrispondente al token è stato fornito
 */
export function useStore<TState extends StoreState, TActions>(
    token: symbol
): StoreApi<TState, TActions> {
    // percorre lo stack dal più recente (padre vicino) al più vecchio (radice)
    for (let i = storeStack.length - 1; i >= 0; i--) {
        const storeMap = storeStack[i];
        if (storeMap.has(token)) {
            return storeMap.get(token)! as StoreApi<TState, TActions>;
        }
    }

    throw new Error(`No store provided for token ${token.toString()} in component tree`);
}
