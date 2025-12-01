// src/stores/delegheAssicurativeStore.ts

import { createStore } from "react-mini-store";
import type { IDelegheStoreState, IDelegheStoreActions } from "./intefaces/delegheStoreInterface";



export const delegheAssicurativeStore = createStore<IDelegheStoreState, IDelegheStoreActions>({
    state: { items: [] as number[] },
    actions: (set) => ({
        addItem: (n: number) => set(s => { s.items.push(n); }),
        resetItems: () => set(() => ({ items: [] })),
        async fetchItems() {
            const data = await new Promise<number[]>(res => setTimeout(() => res([10, 20, 30]), 200));
            set(s => { s.items = data; });
        }
    }),
    computed: {
        total: s => s.items.length
    }
});

// export type
export type IDelegheStoreApi = typeof delegheAssicurativeStore;
