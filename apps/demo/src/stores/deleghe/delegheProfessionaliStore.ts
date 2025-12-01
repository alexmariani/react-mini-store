// src/stores/delegheProfessionaliStore.ts

import { createStore } from "react-mini-store";
import type { IDelegheStoreActions, IDelegheStoreState } from "./intefaces/delegheStoreInterface";

export const delegheProfessionaliStore = createStore<IDelegheStoreState, IDelegheStoreActions>({
    state: { items: [] as number[] },
    actions: (set) => ({
        addItem: (n: number) => set(s => { s.items.push(n * 2); }),  // diversa logica
        resetItems: () => set(() => ({ items: [] })),
        async fetchItems() {
            const data = await new Promise<number[]>(res => setTimeout(() => res([1, 2, 3, 4]), 200));
            set(s => { s.items = data; });
        }
    }),
    computed: {
        total: s => s.items.length
    }
});

// export type
export type IDelegheStoreApi = typeof delegheProfessionaliStore;
