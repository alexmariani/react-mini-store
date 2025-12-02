// src/App.tsx

import { useMemo } from "react";
import { StoreProvider } from "react-mini-store";
import { createTodoStore, TodoToken } from "../stores/todoStore";
import { TodoWidget } from "./TodoWidget";

export default function Dashboard() {
  // 1. Creiamo DUE istanze separate dello store.
  // Usiamo useMemo per garantire che siano stabili tra i render.

  const workStore = useMemo(
    () => createTodoStore("work-todos-v1", "Prepare Meeting"),
    []
  );

  const homeStore = useMemo(
    () => createTodoStore("home-todos-v1", "Buy Milk"),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 p-10 flex gap-10 justify-center items-start">
      {/* --- AMBITO LAVORO --- */}
      <StoreProvider stores={[[TodoToken, workStore]]}>
        {/* Questo widget vedrà SOLO lo store lavoro */}
        <TodoWidget title="🏢 Lavoro" color="border-blue-500" />
        {/* Debugger specifico per questa istanza */}
      </StoreProvider>

      {/* --- AMBITO CASA --- */}
      <StoreProvider stores={[[TodoToken, homeStore]]}>
        {/* Questo widget vedrà SOLO lo store casa */}
        <TodoWidget title="🏠 Casa" color="border-green-500" />
      </StoreProvider>
    </div>
  );
}
