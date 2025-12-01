import { StoreApi } from '../core/createStore';
export declare const IDelegheStoreToken: unique symbol;
export interface IDelegheStoreState {
    items: number[];
}
export interface IDelegheStoreActions {
    addItem: (n: number) => void;
    resetItems: () => void;
    fetchItems: () => Promise<void>;
}
export declare const delegheStore: StoreApi<IDelegheStoreState, IDelegheStoreActions>;
export type IDelegheStoreApi = typeof delegheStore;
