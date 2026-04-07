"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Todo, Filter, Priority } from "@/types/todo";
import TodoInput from "@/components/TodoInput";
import TodoItem from "@/components/TodoItem";
import TodoFilter from "@/components/TodoFilter";

const API_URL = "https://todo-bachend.onrender.com/api/todos";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("取得に失敗しました");
        return res.json();
      })
      .then((data: Todo[]) => setTodos(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = useCallback(async (title: string, priority: Priority) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false, priority }),
    });
    if (!res.ok) return;
    const created: Todo = await res.json();
    setTodos((prev) => [created, ...prev]);
  }, []);

  const handleToggle = useCallback(async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    });
    if (!res.ok) return;
    const updated: Todo = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, [todos]);

  const handleDelete = useCallback(async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleEdit = useCallback(async (id: number, title: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...todo, title }),
    });
    if (!res.ok) return;
    const updated: Todo = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, [todos]);

  const handleClearCompleted = useCallback(async () => {
    const completed = todos.filter((t) => t.completed);
    await Promise.all(
      completed.map((t) => fetch(`${API_URL}/${t.id}`, { method: "DELETE" }))
    );
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, [todos]);

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
        <TodoInput onAdd={(title, priority) => handleAdd(title, priority)} />

        <TodoFilter current={filter} onChange={setFilter} counts={counts} />

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">読み込み中...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 text-sm">{error}</div>
        ) : filteredTodos.length === 0 ? (
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

        {counts.completed > 0 && !loading && (
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
