import { StoreSnapshot, StoreState } from './createStore';
import { StoreToken } from './storeContext';
export declare function useStore<TState extends StoreState, TActions, U>(token: StoreToken<TState, TActions>, selector: (state: StoreSnapshot<TState>) => U, equalityFn?: (a: U, b: U) => boolean): U;
export declare function useStoreActions<TState extends StoreState, TActions>(token: StoreToken<TState, TActions>): TActions;
