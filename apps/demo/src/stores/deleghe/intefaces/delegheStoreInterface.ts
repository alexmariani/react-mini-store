export interface IDelegheStoreState {
    items: number[];
}


export interface IDelegheStoreActions {
    addItem(n: number): void;
    resetItems(): void;
    fetchItems(): Promise<void>;
}
