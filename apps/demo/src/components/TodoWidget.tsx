// src/features/todo/TodoWidget.tsx
import { useStore } from "react-mini-store";
import { TodoToken, type TodoState } from "../stores/todoStore";
import { TodoInput, TodoList, TodoStats } from "./components"; // I tuoi componenti di prima

export const TodoWidget = ({
  title,
  color,
}: {
  title: string;
  color: string;
}) => {
  const count = useStore(TodoToken, (s: TodoState) => s.todos.length);

  return (
    <div
      className={`border-t-4 ${color} bg-white shadow-lg rounded-lg p-4 w-80`}
    >
      <h2 className="text-xl font-bold mb-4 flex justify-between">
        {title}
        <span className="text-sm bg-gray-200 px-2 rounded-full text-gray-600">
          {count}
        </span>
      </h2>

      <TodoStats />
      <div className="my-4 border-b" />
      <TodoInput />
      <div className="mt-4">
        <TodoList />
      </div>
    </div>
  );
};
