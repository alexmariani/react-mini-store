import { default as React } from 'react';
import { StoreApi, StoreState } from './createStore';
/**
 * HOC padre che fornisce uno store al subtree senza passarlo come prop
 * @param Component componente da wrappare
 * @param token token dello store
 * @param store store da fornire
 */
export declare function withStoreProvider<P extends object, TState extends StoreState, TActions>(Component: React.ComponentType<P>, token: symbol, store: StoreApi<TState, TActions>): React.FC<P>;
