import { createPersistMiddleware, createStore, createStoreToken, loggerMiddleware } from "react-mini-store";

// --- 1. TIPI ---
export type Todo = { id: string; title: string; completed: boolean };
export type FilterType = "ALL" | "ACTIVE" | "COMPLETED";

export interface TodoState {
    todos: Todo[];
    filter: FilterType;
}

export interface TodoActions {
    add: (title: string) => void;
    toggle: (id: string) => void;
    remove: (id: string) => void;
    setFilter: (filter: FilterType) => void;
}

// --- 2. TOKEN (La chiave per la Dependency Injection) ---
export const TodoToken = createStoreToken<TodoState, TodoActions>();

// --- 3. FACTORY (Crea l'istanza dello store) ---
export const createTodoStore = (storageKey: string, initialTitle: string) => {
    return createStore<TodoState, TodoActions>({
        // Stato Iniziale
        state: {
            todos: [{ id: '1', title: initialTitle, completed: false }],
            filter: "ALL",
        },

        // Middleware: Log in console + Salvataggio automatico
        middleware: [
            loggerMiddleware,
            createPersistMiddleware(storageKey)
        ],

        // Valori Calcolati (Memoizzati automaticamente se lo stato non cambia)
        computed: {
            // Ritorna solo i todo visibili in base al filtro
            visibleTodos: (state) => {
                if (state.filter === "ALL") return state.todos;
                if (state.filter === "COMPLETED") return state.todos.filter(t => t.completed);
                return state.todos.filter(t => !t.completed);
            },
            // Statistiche
            stats: (state) => {
                const total = state.todos.length;
                const completed = state.todos.filter(t => t.completed).length;
                const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
                return { total, completed, active: total - completed, percent };
            }
        },

        actions: (set) => ({
            add: (title) => set((s) => {
                s.todos.push({ id: crypto.randomUUID(), title, completed: false });
            }, "TODO_ADD"),

            toggle: (id) => set((s) => {
                const todo = s.todos.find(t => t.id === id);
                if (todo) todo.completed = !todo.completed;
            }, "TODO_TOGGLE"),

            remove: (id) => set((s) => {
                s.todos = s.todos.filter(t => t.id !== id);
            }, "TODO_REMOVE"),

            setFilter: (filter) => set((s) => {
                s.filter = filter;
            }, "FILTER_SET")
        }),
    });
};
