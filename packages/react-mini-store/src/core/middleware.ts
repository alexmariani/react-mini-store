import { QueryClient } from "@tanstack/react-query";
import { Middleware, SetState, StoreApi, StoreState } from "./createStore";

/**
 * LOGGER MIDDLEWARE
 * Stampa in console lo stato precedente, l'azione e lo stato successivo.
 */
export const loggerMiddleware = <T extends StoreState, A>(
    store: StoreApi<T, A>
): StoreApi<T, A> => {
    const originalSetState = store.setState;

    const loggedSetState: SetState<T> = (updater, actionName) => {
        const prev = store.getState();
        console.groupCollapsed(
            `%cAction: ${actionName || "Anonymous Update"}`,
            "font-weight: bold;"
        );
        console.log("%c Prev State:", "color: #9E9E9E", prev);

        // Eseguiamo l'aggiornamento reale
        originalSetState(updater, actionName);

        const next = store.getState();
        console.log("%c Next State:", "color: #4CAF50", next);
        console.groupEnd();
    };

    return { ...store, setState: loggedSetState };
};

/**
 * PERSIST MIDDLEWARE FACTORY
 * Salva e carica lo stato dal localStorage.
 */
export const createPersistMiddleware = <T extends StoreState, A>(key: string) => {
    return (store: StoreApi<T, A>): StoreApi<T, A> => {
        const originalSetState = store.setState;

        // 1. Idratazione iniziale (Se c'è qualcosa nel storage, caricalo)
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Forziamo un aggiornamento iniziale senza log
                originalSetState(() => parsed, "@@INIT_PERSIST");
            }
        } catch (e) {
            console.warn("Persist Middleware: Failed to load state", e);
        }

        // 2. Intercetta i set state per salvare
        const persistSetState: SetState<T> = (updater, actionName) => {
            originalSetState(updater, actionName);

            // Salviamo dopo l'update
            try {
                // Nota: non salviamo i computed, solo lo stato raw!
                // store.getState() ritorna { ...state, computed }, dobbiamo pulirlo se vogliamo salvare solo il raw
                // Ma per semplicità, qui prendiamo tutto tranne computed.
                const snapshot = store.getState();
                const { computed, ...rawState } = snapshot;
                localStorage.setItem(key, JSON.stringify(rawState));
            } catch (e) {
                console.error("Persist Middleware: Failed to save state", e);
            }
        };

        return { ...store, setState: persistSetState };
    };
};

// Estensione dell'interfaccia window per TypeScript
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: any;
    }
}

export const devtools = <T extends StoreState, A>(
    storeName: string
): Middleware<T, A> => {
    return (store) => {
        const extension = window.__REDUX_DEVTOOLS_EXTENSION__;

        // Se non c'è l'estensione, ritorna lo store normale
        if (!extension) return store;

        const devTools = extension.connect({ name: storeName });
        const originalSetState = store.setState;

        // Invia lo stato iniziale
        devTools.init(store.getState());

        // Intercetta i set state
        const setWithDevTools: SetState<T> = (updater, actionName) => {
            originalSetState(updater, actionName);

            // Invia l'azione a DevTools
            // Nota: inviamo lo stato "raw" senza computed per pulizia,
            // ma puoi inviare anche quello completo se preferisci.
            const { computed, ...rawState } = store.getState();

            devTools.send(
                { type: actionName || "Anonymous Action" },
                rawState
            );
        };

        // Opzionale: Ascolta i dispatch temporali dal tool (Time Travel basic)
        // Nota: Per un vero Time Travel servirebbe un refactoring più profondo,
        // qui gestiamo solo il logging visivo.

        return { ...store, setState: setWithDevTools };
    };
};

type ValidatorFn<T> = (newState: T, oldState: T, actionName?: string) => boolean;

export const createValidatorMiddleware = <T extends StoreState, A>(
    isValid: ValidatorFn<T>
): Middleware<T, A> => {
    return (store) => {
        const originalSetState = store.setState;

        const validatedSetState: SetState<T> = (updater, actionName) => {
            // Per validare dobbiamo calcolare il "next state" teorico senza applicarlo
            // Immer produce ci aiuta qui: non modifica, ritorna solo il next
            const currentState = store.getState();

            // ATTENZIONE: Qui serve importare 'produce' da immer anche nel middleware
            // o usare una logica simile. Assumiamo che l'updater sia standard immer.
            // Poiché non abbiamo accesso facile a 'produce' qui dentro senza importarlo,
            // facciamo un approccio ottimistico:

            originalSetState((draft) => {
                // Applichiamo la modifica al draft
                updater(draft);

                // Controlliamo il draft risultante (Immer permette di ispezionare il draft come fosse stato)
                // Nota: Questo controllo avviene DENTRO il ciclo di produce dello store originale
                const nextStatePotential = draft as unknown as T; // Cast necessario con Immer

                // Se non è valido, lanciamo errore (che bloccherà l'aggiornamento di immer)
                if (!isValid(nextStatePotential, currentState, actionName)) {
                    console.error(`State validation failed for action: ${actionName}`);
                    // In immer, lanciare un errore annulla le modifiche
                    throw new Error(`Validation Failed: Invalid State produced by ${actionName}`);
                }
            }, actionName);
        };

        return { ...store, setState: validatedSetState };
    };
};




/**
 * Middleware che ascolta cambiamenti nello store e invalida le query.
 * Utile per ricaricare i dati server quando cambiano i filtri client.
 */
export const createQuerySyncMiddleware = <T extends StoreState, A>(
    queryClient: QueryClient,
    config: {
        // Mappa: Se cambia questa proprietà dello stato -> Invalida questa Query Key
        watch: (state: T) => any[];
        queryKey: string[];
    }
): Middleware<T, A> => {
    return (store) => {
        const originalSetState = store.setState;

        // Memoizziamo il valore precedente del watch
        let prevWatchValue: any[] = [];

        // Inizializzazione pigra
        setTimeout(() => {
            prevWatchValue = config.watch(store.getState());
        }, 0);

        const syncSetState: typeof originalSetState = (updater, actionName) => {
            originalSetState(updater, actionName);

            const newState = store.getState();
            const newWatchValue = config.watch(newState);

            // Confronto superficiale dei valori osservati
            const hasChanged = newWatchValue.some((val, i) => val !== prevWatchValue[i]);

            if (hasChanged) {
                console.log(`[QuerySync] State changed, invalidating: ${config.queryKey}`);

                // Invalida la query per forzare il refetch con i nuovi parametri
                queryClient.invalidateQueries({ queryKey: config.queryKey });

                prevWatchValue = newWatchValue;
            }
        };

        return { ...store, setState: syncSetState };
    };
};
