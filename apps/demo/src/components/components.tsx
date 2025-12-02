import React, { useState } from "react";
import { useStore, useStoreActions } from "react-mini-store";
import {
  TodoToken,
  type FilterType,
  type Todo,
  type TodoActions,
  type TodoState,
} from "../stores/todoStore";

// --- COMPONENTE 1: Input (Zero Re-render quando la lista cambia) ---
export const TodoInput = () => {
  const [text, setText] = useState("");
  // Prendiamo solo le azioni. Questo componente NON ascolta lo stato.
  const { add } = useStoreActions<TodoState, TodoActions>(TodoToken);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    add(text);
    setText("");
  };

  console.log("Render: Input"); // Vedrai questo log pochissime volte
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cosa devi fare?"
        className="border p-2 rounded flex-1"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 rounded">
        Aggiungi
      </button>
    </form>
  );
};

// --- COMPONENTE 2: Statistiche (Usa i Computed) ---
export const TodoStats = () => {
  // Selezioniamo solo l'oggetto stats dai computed.
  // Grazie a shallowEqual (default), se i numeri non cambiano, non renderizza.
  const stats = useStore(TodoToken, (s) => s.computed.stats);

  console.log("Render: Stats");
  return (
    <div className="flex justify-around bg-gray-100 p-2 text-sm text-gray-600">
      <span>Totali: {stats.total}</span>
      <br />
      <span>Fatti: {stats.completed}</span>
      <br />
      <span>Da fare: {stats.active}</span>
      <br />
      <span>Progresso: {stats.percent}%</span>
    </div>
  );
};

// --- COMPONENTE 3: Filtri (Cambia solo se cambia il filtro attivo) ---
export const TodoFilters = () => {
  const currentFilter = useStore(TodoToken, (s) => s.filter);
  const { setFilter } = useStoreActions<TodoState, TodoActions>(TodoToken);

  const filters: FilterType[] = ["ALL", "ACTIVE", "COMPLETED"];

  console.log("Render: Filters");
  return (
    <div className="flex gap-2 p-2 justify-center border-b">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          disabled={f === currentFilter}
          className={`px-3 py-1 rounded ${
            f === currentFilter
              ? "bg-black text-white"
              : "text-gray-500 hover:bg-gray-200"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

// --- COMPONENTE 4: Lista (Renderizza solo gli elementi visibili) ---
export const TodoList = () => {
  // Qui la magia: leggiamo 'visibleTodos' dai computed.
  // Se aggiungo un todo "completato" mentre sono nel filtro "ACTIVE",
  // questo array non cambia e la lista NON fa re-render!
  const todos = useStore<TodoState, TodoActions, Todo[]>(
    TodoToken,
    (s) => s.computed.visibleTodos
  );
  const { toggle, remove } = useStoreActions<TodoState, TodoActions>(TodoToken);

  console.log("Render: List");
  return (
    <ul className="p-4 space-y-2">
      {todos.length === 0 && (
        <li className="text-gray-400 text-center">Nessun task.</li>
      )}

      {todos.map((todo: Todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between border p-2 rounded hover:shadow-sm"
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggle(todo.id)}
              className="w-5 h-5 cursor-pointer"
            />
            <span
              className={todo.completed ? "line-through text-gray-400" : ""}
            >
              {todo.title}
            </span>
          </div>
          <button
            onClick={() => remove(todo.id)}
            className="text-red-500 hover:text-red-700 px-2"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
};
