// src/stores/delegheStore.ts
import { createStore, StoreApi } from "../core/createStore";
import { loggerMiddleware } from "../core/middleware";

// Token per registrare il store nel registry
export const IDelegheStoreToken = Symbol("IDelegheStore");

// Interfaccia dei dati
export interface IDelegheStoreState {
    items: number[];
}

// Interfaccia delle azioni
export interface IDelegheStoreActions {
    addItem: (n: number) => void;
    resetItems: () => void;
    fetchItems: () => Promise<void>;
}

// Creazione dello store
export const delegheStore: StoreApi<IDelegheStoreState, IDelegheStoreActions> = createStore({
    state: { items: [] as number[] },
    actions: (set) => ({
        addItem: (n: number) => set((s) => { s.items.push(n); }),
        resetItems: () => set((s) => { s.items = []; }),
        async fetchItems() {
            const data = await new Promise<number[]>(res => setTimeout(() => res([1, 2, 3]), 300));
            set((s) => { s.items = data; });
        },
    }),
    computed: {
        total: (s) => s.items.length,
        sum: (s) => s.items.reduce((a, b) => a + b, 0),
    },
    middleware: [
        loggerMiddleware("deleghe"),
    ],
});

// Tipo completo dello store
export type IDelegheStoreApi = typeof delegheStore;
