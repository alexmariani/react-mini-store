import { QueryClient } from '@tanstack/react-query';
import { Middleware, StoreApi, StoreState } from './createStore';
/**
 * LOGGER MIDDLEWARE
 * Stampa in console lo stato precedente, l'azione e lo stato successivo.
 */
export declare const loggerMiddleware: <T extends StoreState, A>(store: StoreApi<T, A>) => StoreApi<T, A>;
/**
 * PERSIST MIDDLEWARE FACTORY
 * Salva e carica lo stato dal localStorage.
 */
export declare const createPersistMiddleware: <T extends StoreState, A>(key: string) => (store: StoreApi<T, A>) => StoreApi<T, A>;
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: any;
    }
}
export declare const devtools: <T extends StoreState, A>(storeName: string) => Middleware<T, A>;
type ValidatorFn<T> = (newState: T, oldState: T, actionName?: string) => boolean;
export declare const createValidatorMiddleware: <T extends StoreState, A>(isValid: ValidatorFn<T>) => Middleware<T, A>;
/**
 * Middleware che ascolta cambiamenti nello store e invalida le query.
 * Utile per ricaricare i dati server quando cambiano i filtri client.
 */
export declare const createQuerySyncMiddleware: <T extends StoreState, A>(queryClient: QueryClient, config: {
    watch: (state: T) => any[];
    queryKey: string[];
}) => Middleware<T, A>;
export {};
