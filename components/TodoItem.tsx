"use client";

import { useState } from "react";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, title: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const handleEditSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = editText.trim();
    if (!trimmed) return;
    onEdit(todo.id, trimmed);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditText(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <li className={`flex items-center gap-3 p-4 bg-white rounded-lg border transition-opacity ${todo.completed ? "opacity-60" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 rounded accent-blue-600 cursor-pointer flex-shrink-0"
      />

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleEditKeyDown}
            autoFocus
            className="flex-1 px-2 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            保存
          </button>
          <button
            type="button"
            onClick={() => { setEditText(todo.title); setIsEditing(false); }}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            キャンセル
          </button>
        </form>
      ) : (
        <span
          className={`flex-1 text-gray-800 cursor-pointer ${todo.completed ? "line-through text-gray-400" : ""}`}
          onDoubleClick={() => !todo.completed && setIsEditing(true)}
          title={todo.completed ? "" : "ダブルクリックで編集"}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <div className="flex gap-1 flex-shrink-0">
          {!todo.completed && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="編集"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="削除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
}
