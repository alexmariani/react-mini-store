import { StoreApi, StoreState } from './createStore';
/** Padre registra uno store per il token */
export declare function provideStore<T>(token: symbol, store: StoreApi<any, T>): () => void;
/**
 * Hook per ottenere lo store associato a un token.
 * Risale lo stack dei provider padre-figlio.
 *
 * @param token simbolo che identifica lo store
 * @returns StoreApi con stato TState e azioni TActions
 * @throws errore se nessuno store corrispondente al token è stato fornito
 */
export declare function useStore<TState extends StoreState, TActions>(token: symbol): StoreApi<TState, TActions>;
