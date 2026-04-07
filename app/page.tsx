"use client";

import { useState, useCallback, useMemo } from "react";
import { Todo, Filter, Priority } from "@/types/todo";
import TodoInput from "@/components/TodoInput";
import TodoItem from "@/components/TodoItem";
import TodoFilter from "@/components/TodoFilter";

const INITIAL_TODOS: Todo[] = [
  {
    id: "1",
    text: "Next.js の公式ドキュメントを読む",
    completed: false,
    priority: "high",
    createdAt: new Date(),
  },
  {
    id: "2",
    text: "Tailwind CSS を使いこなす",
    completed: false,
    priority: "medium",
    createdAt: new Date(),
  },
  {
    id: "3",
    text: "TypeScript の型定義を学ぶ",
    completed: true,
    priority: "low",
    createdAt: new Date(),
  },
];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [filter, setFilter] = useState<Filter>("all");

  const handleAdd = useCallback((text: string, priority: Priority) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      createdAt: new Date(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const handleEdit = useCallback((id: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  }, []);

  const handleClearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos]
  );

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">TODO リスト</h1>
        <p className="text-gray-500 text-sm">タスクを管理しましょう</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <TodoInput onAdd={handleAdd} />

        <TodoFilter current={filter} onChange={setFilter} counts={counts} />

        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">タスクがありません</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </ul>
        )}

        {counts.completed > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
            <span>{counts.active} 件の未完了タスク</span>
            <button
              onClick={handleClearCompleted}
              className="text-red-500 hover:text-red-700 hover:underline transition-colors"
            >
              完了済みを削除 ({counts.completed})
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
