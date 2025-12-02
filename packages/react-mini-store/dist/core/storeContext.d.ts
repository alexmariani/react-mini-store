import { default as React } from 'react';
import { StoreApi } from './createStore';
export type StoreToken<TState, TActions> = symbol;
export declare const createStoreToken: <S, A = any>() => StoreToken<S, A>;
type StoreMap = Map<symbol, StoreApi<any, any>>;
export interface StoreProviderProps {
    stores: [StoreToken<any, any>, StoreApi<any, any>][];
    children: React.ReactNode;
}
export declare const StoreProvider: ({ stores, children }: StoreProviderProps) => React.JSX.Element;
export declare const useStoreRegistry: () => StoreMap;
export {};
